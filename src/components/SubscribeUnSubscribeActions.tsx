import React, { Dispatch, Fragment } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { MethodT } from "../sharedTypes";
import toast from "react-hot-toast";
import { handleApiError } from "../utils/apiHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleSubscribeUnSubscribe } from "../apis";

type ActionsProps = {
  token: string;
  method: MethodT;
  setMethod: Dispatch<React.SetStateAction<MethodT>>;
};

const SubscribeUnSubscribeActions = (props: ActionsProps) => {
  const { method, token, setMethod } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ topic: string }>();
  const queryClient = useQueryClient();
  const subscribeMutation = useMutation({
    mutationFn: handleSubscribeUnSubscribe,
    onSuccess: (response) => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["topics"] });
      toast.success(response.data.message);
    },
    onError: (e) => {
      handleApiError(e);
    },
  });

  const onSubmit: SubmitHandler<{ topic: string }> = async (
    values
  ): Promise<void> => {
    subscribeMutation.mutate({
      topic: values.topic.trim(),
      token,
      method,
    });
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

          <button
            type="submit"
            className="btn !w-fit"
            disabled={subscribeMutation.isPending}
          >
            {method}
          </button>
        </div>
      </form>
    </Fragment>
  );
};

export default SubscribeUnSubscribeActions;
