import React, { useState, useEffect } from 'react';
import './task-editor.css';
import { useForm, Resolver, SubmitHandler } from 'react-hook-form';
import type { TaskType } from '../../../../types';
import { useNavigationStore } from '../../../../stores/navigationStore';
import { useTasksStore } from '../../../../stores/taskStore';

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

export function TaskEditor({ TaskData }: { TaskData: TaskType | null }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TaskType>({ resolver });

  const { current_edit_task_id } = useNavigationStore();
  const { updateTask } = useTasksStore();

  const onSubmit: SubmitHandler<TaskType> = async (data) => {
    if (current_edit_task_id) {
      const response = fetch('');
      data.id = current_edit_task_id;
      updateTask(data,current_edit_task_id);
    }
  };

  useEffect(() => {
    if (TaskData) {
      setValue('title', TaskData.title);
      setValue('body', TaskData.body);
      // setValue("time.startTime",new Date(TaskData.time.startTime))
      // setStartTime(formatDateString(new Date(TaskData.time.startTime)));
      // setEndTime(formatDateString(new Date(TaskData.time.endTime)));
    }
  }, [TaskData, setValue]);

  return (
    <>
      {TaskData && (
        <div className="task-editor-container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register('title')}
              placeholder="Task Title"
              className="task-title"
            />
            {errors?.title && (
              <span className="error-message">*{errors.title.message}</span>
            )}
            <textarea
              id="body"
              {...register('body')}
              placeholder="Task Body"
              className="task-body"
            />
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
