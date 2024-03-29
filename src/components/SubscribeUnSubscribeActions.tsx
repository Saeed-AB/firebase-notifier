import { Fragment } from "react";
import {
  useForm,
  SubmitHandler,
  ValidateResult,
  useFormState,
} from "react-hook-form";
import toast from "react-hot-toast";
import { handleApiError } from "../utils/apiHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleSubscribeUnSubscribe } from "../apis";
import { confirmationStore } from "../store/firebase";
import { Button } from "./atoms/Button";

const SubscribeUnSubscribeActions = () => {
  const { firebaseToken } = confirmationStore((store) => store);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<{ topic: string }>({
    mode: "onTouched",
  });

  const queryClient = useQueryClient();
  const { isDirty, isValid } = useFormState({
    control,
  });

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

  const topicValidate = (value: string): ValidateResult => {
    if (!value || !value.trim()) {
      return "This field is required";
    }

    if (value.split(" ").length > 1) {
      return "topic should not contain more than one word";
    }

    return undefined;
  };

  const onSubmit: SubmitHandler<{ topic: string }> = async (
    values
  ): Promise<void> => {
    if (firebaseToken) {
      subscribeMutation.mutate({
        topic: values.topic.trim(),
        token: firebaseToken,
        method: "Subscribe",
      });
    }
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex gap-2 h-10 w-full">
          <div className="flex flex-col w-full">
            <input
              {...register("topic", {
                validate: topicValidate,
              })}
              className="input"
              placeholder="Insert Topic To Subscribe"
            />
            {errors.topic && (
              <span className="text-sm text-red-600">
                {errors.topic.message}
              </span>
            )}
          </div>

          <Button
            fitContent
            type="submit"
            label="Subscribe"
            disabled={subscribeMutation.isPending || !isDirty || !isValid}
          />
        </div>
      </form>
    </Fragment>
  );
};

export default SubscribeUnSubscribeActions;
