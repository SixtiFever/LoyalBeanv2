import { ButtonProps } from "react-native";

export interface SVGIconProps extends Partial<ButtonProps> {
    width?: string;
    height?: string;
    strokeWidth?: number;
    color?: string;
}