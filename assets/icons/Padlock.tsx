import { SVGIconProps } from "@/types/SVGIconProps";
import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
const PadlockIcon: React.FC<SVGIconProps> = ({...props}) => (
  <Svg
    width={ props.width ? `${props.width}px` : "68px"}
    height={ props.height ? `${props.height}px` : "84px"}
    viewBox="0 0 68 84"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <G id="Web" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <G
        id="noun-padlock-7690467"
        transform="translate(0.668000, 0.000000)"
        fill={`${props.color ?? 'black'}`}
        fillRule="nonzero"
      >
        <Path
          d="M58.332,34.1016 L58.332,25 C58.332,11.215 47.117,0 33.332,0 C19.547,0 8.332,11.215 8.332,25 L8.332,34.1016 C3.4922,35.8282 0,40.4102 0,45.8356 L0,70.8356 C0,77.7301 5.6055,83.3356 12.5,83.3356 L54.168,83.3356 C61.0625,83.3356 66.668,77.7301 66.668,70.8356 L66.668,45.8356 C66.664093,40.4098 63.1719,35.8276 58.3321,34.1016 L58.332,34.1016 Z M37.5,62.4996 C37.5,64.8043 35.6367,66.6676 33.332,66.6676 C31.0273,66.6676 29.164,64.8043 29.164,62.4996 L29.164,54.1676 C29.164,51.8629 31.0273,49.9996 33.332,49.9996 C35.6367,49.9996 37.5,51.8629 37.5,54.1676 L37.5,62.4996 Z M50,33.3356 L16.664,33.3356 L16.664,24.9997 C16.664,15.8083 24.1406,8.3317 33.332,8.3317 C42.5234,8.3317 50,15.8083 50,24.9997 L50,33.3356 Z"
          id="Shape"
        />
      </G>
    </G>
  </Svg>
);
export default PadlockIcon;
