import "./task-editor.css";
import { useForm, Resolver, useFieldArray } from "react-hook-form";
import type { TaskType } from "../../../types";

const resolver: Resolver<TaskType> = async (values) => {
  const errors: any = {};
  if (!values.body) {
    errors.body = {
      type: "required",
      message: "Body field is required.",
    };
  }

  if (values.body && values.body.length > 300) {
    errors.body = {
      type: "maxLength",
      message: "Max length of body is 300 characters.",
    };
  }

  if (!values.title) {
    errors.title = {
      type: "required",
      message: "Title is required.",
    };
  }

  if (values.title && values.title.length > 25) {
    errors.title = {
      type: "maxLength",
      message: "Max length of title is 25 characters.",
    };
  }

  values.times.forEach((time, index) => {
    if (!time.startTime) {
      errors.times = errors.times || [];
      errors.times[index] = errors.times[index] || {};
      errors.times[index].startTime = {
        type: "required",
        message: "Start time is required.",
      };
    }

    if (!time.endTime) {
      errors.times = errors.times || [];
      errors.times[index] = errors.times[index] || {};
      errors.times[index].endTime = {
        type: "required",
        message: "End time is required.",
      };
    }

    if(time.endTime.getTime() < time.startTime.getTime()){
      errors.time = errors.time || [];
      errors.times[index] = errors.times[index] || {};
      errors.times[index].startTime= {
        type:"timeError",
        message: "End time can't be before the start time for task."
      }
    }
  });

  return {
    values: values.title ? values : {},
    errors: !values.title
      ? {
          title: {
            type: "required",
            message: "Title field is required.",
          },
        }
      : {},
  };
};

export function TaskEditor({ TaskData }: { TaskData: TaskType }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TaskType>({ resolver });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "times",
  });
  const onSubmit = handleSubmit((data) => console.log(data));
  return (
    <>
      <div className="task-editor-container">
        <form onSubmit={onSubmit}>
          <input
            {...(register("title"), { required: true })}
            placeholder="Task Title"
            className="task-title"
          />
          {errors?.title && (
            <span className="error-message">{errors.title.message}</span>
          )}
          <textarea
            id="body"
            {...(register("body"), { required: true })}
            placeholder="Task Body"
            className="task-body"
          />
          {errors?.body && (
            <span className="error-message">{errors.body.message}</span>
          )}

          {fields.map((field, index) => (
            <>
              <div className="time-slot-container">
                <input
                  key={field.id}
                  className="time-slot-selector"
                  {...register(`times.${index}.startTime`)}
                  type="datetime-local"
                />
                <span className="time-slot-separator">-</span>
                <input
                  key={field.id}
                  className="time-slot-selector"
                  {...register(`times.${index}.endTime`)}
                  type="datetime-local"
                />
                <img
                  src="./delete.svg"
                  alt="delete time slot"
                  className="time-slot-delete"
                  onClick={() => remove(index)}
                />
                {errors?.times && (
                  <span className="error-message">{errors.times.message}</span>
                )}
              </div>
            </>
          ))}
          <button
            onClick={() =>
              append({
                startTime: new Date(Date.now()),
                endTime: new Date(Date.now() + 60 * 60 * 1000), //1 hour after startTime
              })
            }
          >
            Add Time slot
          </button>
          <input type="submit" />
        </form>
      </div>
    </>
  );
}
