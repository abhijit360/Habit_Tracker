
import "./task-editor.css"
import {useForm, Resolver} from "react-hook-form";

type FormValues = {
    "title": string
    "body": string
    "times": {"startTime":Date, "endTime": Date}[],
    "state": "completed" | "in-progress" | "started"
}

const resolver: Resolver<FormValues> = async (values) => {
    return {
        values: values.title ? values : {},
        errors: !values.title ? {
            title: {
                type:"required",
                message: "Title field is required.",
            },
        } : {},
    }
}

export function TaskEditor({TaskData}:{ TaskData: FormValues}) {
    const { register, handleSubmit, formState: {errors},} = useForm<FormValues>({resolver})
    const onSubmit = handleSubmit((data) => console.log(data))
    

  return (
    <>
      <div className="task-editor-container">
        <form onSubmit={onSubmit}>
            <input {...register("title"), {required: true}} placeholder="Task Title" className="Task-Title"/>
            {errors?.title && <p>{errors.title.message}</p>}

            <input {...register("body"), {required: true}} placeholder="Task Body" className="Task-body"/>

            <input type="submit" />
        </form>
    
      </div>
    </>
  );
}
