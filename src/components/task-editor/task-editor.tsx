import "./task-editor.css";
import { useForm, Resolver, useFieldArray } from "react-hook-form";

type FormValues = {
  title: string;
  body: string;
  times: { startTime: Date; endTime: Date }[];
  state: "completed" | "in-progress" | "started";
};

const resolver: Resolver<FormValues> = async (values) => {
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

export function TaskEditor({ TaskData }: { TaskData: FormValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({ resolver });
  const { fields, append, remove, move } = useFieldArray({
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
            className="Task-Title"
          />
          {errors?.title && <p>{errors.title.message}</p>}

          <input
            {...(register("body"), { required: true })}
            placeholder="Task Body"
            className="Task-body"
          />
          {fields.map((field, index) => (
            <>
              <div className="time-slot-container">
                <input
                  key={field.id}
                  className="time-slot-selector"
                  {...register(`times.${index}.startTime`)}
                />
                <span className="time-slot-selector">-</span>
                <input
                  key={field.id}
                  className="time-slot-selector"
                  {...register(`times.${index}.startTime`)}
                />
                <img
                  src="./delete.svg"
                  alt="delete time slot"
                  className="time-slot-delete"
                  onClick={() => remove(index)}
                />
              </div>
            </>
          ))}
          <button
            onClick={() =>
              append({
                startTime: new Date(Date.now()),
                endTime: new Date(Date.now() + +60 * 60 * 1000) //1 hour after startTime
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
