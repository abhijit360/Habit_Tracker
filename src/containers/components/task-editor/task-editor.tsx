import React, { useState, useEffect, useCallback } from 'react';
import './task-editor.css';
import { useForm, Resolver, useFieldArray } from 'react-hook-form';
import type { TaskType } from '../../../../types';
import deleteIcon from '../../../assets/img/delete.svg';
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

  if (!values.body) {
    errors.body = {
      type: 'required',
      message: 'Body field is required.',
    };
  } else if (values.body.length > 300) {
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

export function TaskEditor({ TaskData }: { TaskData: TaskType }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TaskType>({ resolver });
  const [currentTask, setCurrentTask] = useState<TaskType>({} as TaskType);
  const onSubmit = handleSubmit((data) => console.log(data));
  const { current_task_id } = useNavigationStore();
  const { tasks } = useTasksStore();

  const getCurrentTask = useCallback(() => {
    setCurrentTask(tasks.filter((task) => task.id === current_task_id)[0]);
  },[current_task_id, tasks]);

  useEffect(() => {
    getCurrentTask();
  }, [getCurrentTask]);

  return (
    <>
      <div className="task-editor-container">
        <form onSubmit={onSubmit}>
          <input
            {...register('title')}
            placeholder="Task Title"
            value={currentTask.title}
            className="task-title"
          />
          {errors?.title && (
            <span className="error-message">*{errors.title.message}</span>
          )}
          <textarea
            id="body"
            {...register('body')}
            placeholder="Task Body"
            value={currentTask.body}
            className="task-body"
          />
          {errors?.body && (
            <span className="error-message">*{errors.body.message}</span>
          )}
          <div className="time-slot-container">
            <input
              className="time-slot-selector"
              {...register(`time.startTime`)}
              value={new Date(currentTask.time.startTime).toISOString()}
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
              value={new Date(currentTask.time.endTime).toISOString()}
              type="datetime-local"
            />
            {errors?.time?.endTime && (
              <span className="error-message">
                *{errors?.time.endTime?.message}
              </span>
            )}
          </div>
          <input type="submit" />
        </form>
      </div>
    </>
  );
}
