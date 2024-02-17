import React, { Dispatch, Fragment } from "react";
import { MethodT } from "../App";
import { useForm, SubmitHandler } from "react-hook-form";

type ActionsProps = {
  method: MethodT;
  setMethod: Dispatch<React.SetStateAction<MethodT>>;
  getTopics: () => Promise<void>;
  handleSubscribeUnSubscribe: (v: string) => Promise<Response>;
};

const Actions = (props: ActionsProps) => {
  const { method, setMethod } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ topic: string }>();

  const onSubmit: SubmitHandler<{ topic: string }> = async (
    values
  ): Promise<void> => {
    const response = await props.handleSubscribeUnSubscribe(values.topic.trim());
    const data = await response.json();
    console.log("data", data);

    if (response.status === 200) {
      props.getTopics();
      reset();
    }
  };

  return (
    <Fragment>
      <div className="flex gap-2 text-center">
        <button
          className={`btn ${
            method === "Subscribe" && "!bg-neutral-400 cursor-default"
          }`}
          onClick={() => setMethod("Subscribe")}
        >
          Subscribe
        </button>
        <button
          className={`btn ${
            method === "UnSubscribe" && "!bg-neutral-400 cursor-default"
          }`}
          onClick={() => setMethod("UnSubscribe")}
        >
          UnSubscribe
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "flex", gap: 8, height: 40 }}>
          <div className="flex flex-col">
            <input
              {...register('topic', {
                validate: (value) => value.trim() !== '' || 'This field is required',
              })}
              className="input"
              placeholder={`Insert Topic To ${method}`}
            />
            {errors.topic && (
              <span className="text-sm text-red-600">
                {errors.topic.message}
              </span>
            )}
          </div>

          <button type="submit" className="btn !w-fit">
            {method}
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default Actions;
