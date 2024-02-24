import React, { Dispatch, Fragment } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { MethodT } from "../sharedTypes";
import {  AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { handleApiError } from "../utils/apiHandler";

type ActionsProps = {
  method: MethodT;
  setMethod: Dispatch<React.SetStateAction<MethodT>>;
  getTopics: () => Promise<void>;
  handleSubscribeUnSubscribe: (
    v: string
  ) => Promise<AxiosResponse<{ message: string }>>;
};

const SubscribeUnSubscribeActions = (props: ActionsProps) => {
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
    try {
      const response = await props.handleSubscribeUnSubscribe(
        values.topic.trim()
      );
      toast.success(response.data.message);
      props.getTopics();
      reset();
    } catch (e) {
      handleApiError(e);
    }
  };

  return (
    <Fragment>
      <div className="flex gap-2 text-center w-full">
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

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex gap-2 h-10 w-full">
          <div className="flex flex-col w-full">
            <input
              {...register("topic", {
                validate: (value) =>
                  value.trim() !== "" || "This field is required",
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

export default SubscribeUnSubscribeActions;
