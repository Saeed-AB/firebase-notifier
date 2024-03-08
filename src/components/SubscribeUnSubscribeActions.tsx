import { Fragment } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { MethodT } from "../sharedTypes";
import toast from "react-hot-toast";
import { handleApiError } from "../utils/apiHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleSubscribeUnSubscribe } from "../apis";
import { confirmationStore } from "../store/firebase";
import { Button } from "./atoms/Button";

type ActionsProps = {
  method: MethodT;
  handleUpdateMethod: (v: MethodT) => void;
};

const methodsList: { value: MethodT }[] = [
  {
    value: "Subscribe",
  },
  {
    value: "UnSubscribe",
  },
];

const SubscribeUnSubscribeActions = (props: ActionsProps) => {
  const { method } = props;
  const { firebaseToken } = confirmationStore((store) => store);

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
    if (firebaseToken) {
      subscribeMutation.mutate({
        topic: values.topic.trim(),
        token: firebaseToken,
        method,
      });
    }
  };

  return (
    <Fragment>
      <div className="flex gap-2 text-center w-full">
        {methodsList.map((item) => (
          <Button
            key={item.value}
            onClick={() => props.handleUpdateMethod(item.value)}
            label={item.value}
            isActive={method === item.value}
          />
        ))}
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

          <Button
            fitContent
            type="submit"
            label={method}
          />
        </div>
      </form>
    </Fragment>
  );
};

export default SubscribeUnSubscribeActions;
