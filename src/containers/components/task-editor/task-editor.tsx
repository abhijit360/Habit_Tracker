import React, { useState, useEffect } from 'react';
import './task-editor.css';
import { useForm, Resolver, SubmitHandler } from 'react-hook-form';
import type { TaskType } from '../../../../types';
import { useNavigationStore } from '../../../../stores/navigationStore';
import { useTasksStore } from '../../../../stores/taskStore';
import { Task } from '../task-display/task';
import { useCalendarStore } from '../../../../stores/calendarStore';

const resolver: Resolver<TaskType> = async (values) => {
  const errors: any = {};
  if (!values.title) {
    errors.title = {
      type: 'required',
      message: 'Title is required.',
    };
  } else if (values.title.length > 25) {
    errors.title = {
      type: 'maxLength',
      message: 'Max length of title is 25 characters.',
    };
  }

  if (values.body.length > 300) {
    errors.body = {
      type: 'maxLength',
      message: 'Max length of body is 300 characters.',
    };
  }

  if (values.time) {
    if (!values.time.startTime) {
      errors.times.startTime = {
        type: 'required',
        message: 'Start time is required.',
      };
    }

    if (!values.time.endTime) {
      errors.times.endTime = {
        type: 'required',
        message: 'End time is required.',
      };
    }

    if (
      new Date(values.time.endTime).getTime() <
      new Date(values.time.startTime).getTime()
    ) {
      errors.times.endTime = {
        type: 'timeError',
        message: "End time can't be before the start time.",
      };
    }
  }

  return {
    values: Object.keys(errors).length ? {} : values,
    errors,
  };
};

function formatDateString(date: Date): string {
  const pad = (number: number) => (number < 10 ? '0' : '') + number;
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes())
  );
}

export function TaskEditor({
  TaskData,
  state,
}: {
  TaskData: TaskType | null;
  state: 'add' | 'edit';
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TaskType>({ resolver });

  const { current_edit_task_id } = useNavigationStore();
  const { updateTask, tasks } = useTasksStore();
  const { calendars } = useCalendarStore();

  const TITLE_CHAR_LIMIT = 30;
  const BODY_CHAR_LIMIT = 500;

  const [titleCharacterCount, setTitleCharacterCount] = useState<number>(TITLE_CHAR_LIMIT);
  const [bodyCharacterCount, setBodyCharacterCount] = useState<number>(BODY_CHAR_LIMIT);

  const [calendarID, setCalendarID] = useState<string>('');
  const [calendarError, setCalendarError] = useState<string>('');

  const onSubmit: SubmitHandler<TaskType> = async (data) => {
    const auth_obj = await chrome.storage.session.get(
      'lockIn-curr-google-token'
    );

    console.log("auth-obj taskedit", auth_obj)
    console.log("auth token task edited", auth_obj['lockIn-curr-google-token'])

    console.log(calendarID)
    if (state === 'edit') {
      if (current_edit_task_id) {
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${TaskData?.calendarId}/events/${TaskData?.id}`,
          {
            method: 'POST',
            body: JSON.stringify({
              start: {
                date: data.time.startTime,
                dateTime: data.time.startTime,
              },
              end: {
                date: data.time.endTime,
                dateTime: data.time.endTime,
              },
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth_obj['lockIn-curr-google-token']}`,
            },
          }
        );
        if (response.ok) {
          data.id = current_edit_task_id;
          updateTask(data, current_edit_task_id);
        }
      }
    } else {
      console.log({
        method: 'POST',
        body: JSON.stringify({
          summary: data.title,
          description: data.body,
          start: {
            date: data.time.startTime,
            dateTime: data.time.startTime,
          },
          end: {
            date: data.time.endTime,
            dateTime: data.time.endTime,
          },
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth_obj['lockIn-curr-google-token']}`,
        },
      });
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events/`,
        {
          method: 'POST',
          body: JSON.stringify({
            summary: data.title,
            description: data.body,
            start: {
              date: data.time.startTime,
              dateTime: new Date(data.time.startTime).toISOString(),
            },
            end: {
              date: data.time.endTime,
              dateTime: new Date(data.time.endTime).toISOString(),
            },
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth_obj['lockIn-curr-google-token']}`,
          },
        }
      );

      if (response.ok) {
        console.log('created', await response.json());
      }else{
        console.log("error:",await response.json())
      }
    }
  };

  useEffect(() => {
    if (TaskData && state === 'edit') {
      setValue('title', TaskData.title);
      setValue('body', TaskData.body);
    }
  }, [TaskData, setValue, state]);

  function handleCalendarSelection(e: React.SyntheticEvent) {
    const target = e.currentTarget as HTMLOptionElement;
    console.log('calendarId- addTask', target.value);
    setCalendarID(target.value);
  }

  function handleTitleChange(e: React.ChangeEvent) {
    const target = e.target as HTMLInputElement;
    const textData = target.value;
    setTitleCharacterCount(TITLE_CHAR_LIMIT - textData.length)
  }

  function handleBodyChange(e: React.ChangeEvent) {
    const target = e.target as HTMLInputElement;
    const textData = target.value;
    setBodyCharacterCount(BODY_CHAR_LIMIT - textData.length);
  }

  return (
    <>
      {state === 'add' && (
        <select onChange={handleCalendarSelection}>
          {calendars.map((calendar) => (
            <option value={calendar.calendarId}>{calendar.calendarName}</option>
          ))}
        </select>
      )}
      {TaskData && (
        <div className="task-editor-container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register('title')}
              placeholder="Task Title"
              className="task-title"
              maxLength={TITLE_CHAR_LIMIT}
              type="text"
              onChange={handleTitleChange}
            />
            <span>Character count: {titleCharacterCount}</span>
            {errors?.title && (
              <span className="error-message">*{errors.title.message}</span>
            )}
            <textarea
              id="body"
              {...register('body')}
              placeholder="Task Body"
              className="task-body"
              maxLength={BODY_CHAR_LIMIT}
              onChange={handleBodyChange}
            />
            <span>Character count: {bodyCharacterCount}</span>
            {errors?.body && (
              <span className="error-message">*{errors.body.message}</span>
            )}
            <div className="time-slot-container">
              <input
                className="time-slot-selector"
                {...register(`time.startTime`)}
                type="datetime-local"
              />
              {errors?.time?.startTime && (
                <span className="error-message">
                  *{errors.time?.startTime?.message}
                </span>
              )}
              <span className="time-slot-separator">-</span>
              <input
                className="time-slot-selector"
                {...register(`time.endTime`)}
                type="datetime-local"
              />
              {errors?.time?.endTime && (
                <span className="error-message">
                  *{errors?.time.endTime?.message}
                </span>
              )}
            </div>
            <input
              type="submit"
              onSubmit={(e) => console.log('submitting form', e)}
            />
          </form>
        </div>
      )}
      {!TaskData && <p>Select a task to edit</p>}
    </>
  );
}
