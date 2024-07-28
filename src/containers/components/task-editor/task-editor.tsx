import React, { useState, useEffect } from 'react';
import './task-editor.css';
import { useForm, Resolver, SubmitHandler } from 'react-hook-form';
import type { TaskType } from '../../../../types';
import { useNavigationStore } from '../../../../stores/navigationStore';
import { useTasksStore } from '../../../../stores/taskStore';
import { Task } from '../task-display/task';
import { useCalendarStore } from '../../../../stores/calendarStore';
import { useErrorStore } from '../../../../stores/errorStore';
import { updateLocalTaskState } from '../../../../utils';

const resolver: Resolver<TaskType> = async (values) => {
  const errors: any = {};
  if (values.title.length === 0) {
    errors.title = {
      type: 'required',
      message: 'Title is required.',
    };
  }
  if (!values.time.startTime) {
    errors.time = errors.time || {};
    errors.time.startTime = {
      type: 'required',
      message: 'Start time is required.',
    };
  }

  if (!values.time.endTime) {
    errors.time = errors.time || {};
    errors.time.endTime = {
      type: 'required',
      message: 'End time is required.',
    };
  }

  if (values.time) {
    if (
      new Date(values.time.endTime).getTime() <
      new Date(values.time.startTime).getTime()
    ) {
      errors.time = errors.time || {};
      errors.time.endTime = {
        type: 'timeError',
        message: "End time can't be before the start time.",
      };
    }
    if (
      new Date(values.time.startTime).getTime() >
      new Date(values.time.endTime).getTime()
    ) {
      errors.time = errors.time || {};
      errors.time.startTime = {
        type: 'timeError',
        message: "Start time can't be before the start time.",
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
  TaskData: TaskType;
  state: 'add' | 'edit';
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TaskType>({ resolver, mode: 'onBlur' });

  const { current_edit_task_id, updateNavigation } = useNavigationStore();
  const { updateTask, append, tasks } = useTasksStore();
  const { setError } = useErrorStore();
  const { calendars } = useCalendarStore();

  const TITLE_CHAR_LIMIT = 30;
  const BODY_CHAR_LIMIT = 500;

  const [titleCharacterCount, setTitleCharacterCount] =
    useState<number>(TITLE_CHAR_LIMIT);
  const [bodyCharacterCount, setBodyCharacterCount] =
    useState<number>(BODY_CHAR_LIMIT);

  const [calendarID, setCalendarID] = useState<string>('');
  const [calendName, setCalendarName] = useState<string>('');

  const onSubmit: SubmitHandler<TaskType> = async (data) => {
    const auth_obj = await chrome.storage.session.get(
      'lockIn-curr-google-token'
    );
    if (state === 'edit') {
      if (current_edit_task_id) {
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${TaskData?.calendarId}/events/${TaskData?.id}`,
          {
            method: 'PATCH',
            body: JSON.stringify({
              start: {
                dateTime: new Date(data.time.startTime).toISOString(),
                timeZone: new window.Intl.DateTimeFormat().resolvedOptions()
                  .timeZone,
              },
              end: {
                dateTime: new Date(data.time.endTime).toISOString(),
                timeZone: new window.Intl.DateTimeFormat().resolvedOptions()
                  .timeZone,
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
          updateLocalTaskState(tasks);
          updateNavigation('TaskDisplay');
        } else {
          setError('Server Error: Unable to apply changes');
        }
      }
    } else {
      if (calendarID === '') {
        setError('Please pick a calendar');
        return;
      }
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events/`,
        {
          method: 'POST',
          body: JSON.stringify({
            summary: data.title,
            description: data.body,
            start: {
              dateTime: new Date(data.time.startTime).toISOString(),
              timeZone: new window.Intl.DateTimeFormat().resolvedOptions()
                .timeZone,
            },
            end: {
              dateTime: new Date(data.time.endTime).toISOString(),
              timeZone: new window.Intl.DateTimeFormat().resolvedOptions()
                .timeZone,
            },
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth_obj['lockIn-curr-google-token']}`,
          },
        }
      );

      if (response.ok) {
        const task = await response.json();
        console.log('task created - editor ', task);
        TaskData.id = task.id;
        TaskData.time = data.time;
        TaskData.calendarId = calendarID;
        TaskData.calendarName = calendars.filter(
          (cal) => cal.calendarId == calendarID
        )[0].calendarName;
        TaskData.state = 'new';
        TaskData.title = data.title;
        TaskData.body = data.body;
        append(TaskData);
        updateLocalTaskState(tasks);
        updateNavigation('TaskDisplay');
      } else {
        setError('Server Error: Failed to create task');
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
    const textVal = target.textContent;
    setCalendarID(target.value);
  }

  function handleTitleChange(e: React.ChangeEvent) {
    const target = e.target as HTMLInputElement;
    setTitleCharacterCount(TITLE_CHAR_LIMIT - target.value.length);
  }

  function handleBodyChange(e: React.ChangeEvent) {
    const target = e.target as HTMLInputElement;
    setBodyCharacterCount(BODY_CHAR_LIMIT - target.value.length);
  }

  return (
    <>
      {state === 'add' && (
        <select
          placeholder="Pick a calendar"
          onChange={handleCalendarSelection}
          defaultValue={calendars[0].calendarId}
        >
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
            <span className="input-character-count">
              Character count:{' '}
              <span style={{ fontWeight: 'bold' }}>{titleCharacterCount}</span>
            </span>
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
            <span className="input-character-count">
              Character count:{' '}
              <span style={{ fontWeight: 'bold' }}>{bodyCharacterCount}</span>
            </span>
            {errors?.body && (
              <span className="error-message">*{errors.body.message}</span>
            )}
            <div className="time-slot-container">
              <input
                className="time-slot-selector"
                {...register(`time.startTime`)}
                type="datetime-local"
                defaultValue={
                  TaskData.time
                    ? formatDateString(new Date(TaskData.time.startTime))
                    : ''
                }
              />
              <span className="time-slot-separator">-</span>
              <input
                className="time-slot-selector"
                {...register(`time.endTime`)}
                type="datetime-local"
                defaultValue={
                  TaskData.time
                    ? formatDateString(new Date(TaskData.time.endTime))
                    : ''
                }
              />
            </div>
            <div className="time-error-container">
              {errors?.time?.startTime && (
                <span className="error-message">
                  *{errors.time?.startTime?.message}
                </span>
              )}
              {errors?.time?.endTime && (
                <span className="error-message">
                  *{errors?.time.endTime?.message}
                </span>
              )}
            </div>
            <input
              className="time-submit-button"
              type="submit"
              onSubmit={(e) => console.log('submitting form', e)}
            />
          </form>
        </div>
      )}
    </>
  );
}
