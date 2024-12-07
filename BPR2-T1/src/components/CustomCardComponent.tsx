import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface CustomCardComponentProps {
  text: string | ReactNode;
  bgColor: string;
  textSize?: string;
  width?: string;
  height?: string;
  onClick?: () => void;
}

export const CustomCardComponent: React.FC<CustomCardComponentProps> = ({
  text,
  bgColor,
  textSize = "text-lg",
  width = "w-48",
  height = "h-18",
  onClick
}) => {
  return (
    <Card className={`${width} ${height}`} onClick={onClick}>
      <CardContent
        className={`flex justify-center items-center ${bgColor} rounded-md p-4`}
      >
        <CardTitle className={textSize}>{text}</CardTitle>
      </CardContent>
    </Card>
  );
};
