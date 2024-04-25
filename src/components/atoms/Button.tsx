import { ButtonHTMLAttributes } from "react";

type ButtonPropsT = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
> & {
  label: string;
  isActive?: boolean;
  fitContent?: boolean;
};

export const Button = (props: ButtonPropsT) => {
  const { label, isActive, fitContent, ...rest } = props;

  return (
    <button
      type="button"
      className="btn"
      {...rest}
      data-active={isActive}
      data-fitcontent={fitContent}
    >
      {label}
    </button>
  );
};
