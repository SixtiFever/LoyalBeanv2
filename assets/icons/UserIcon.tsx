import { SVGIconProps } from "@/types/SVGIconProps";
import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
const UserIcon: React.FC<SVGIconProps> = ({...props}) => (
  <Svg
    width={ props.width ? `${props.width}px` : "82px"}
    height={ props.height ? `${props.height}px` : "90px"}
    viewBox="0 0 82 90"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <G id="Web" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <G
        id="noun-user-7698325"
        transform="translate(0.496000, 0.000000)"
        fill={`${props.color ?? 'black'}`}
        fillRule="nonzero"
      >
        <Path
          d="M69.426,90 L11.578,90 C5.1913,90 0,85.1367 0,79.152 L0,78.1403 C0,69.4176 3.7344,61.2103 10.516,55.0383 C17.2113,48.9445 26.051,45.5891 35.414,45.5891 L45.586,45.5891 C54.9493,45.5891 63.797,48.9446 70.488,55.0383 C77.2692,61.2141 81.008,69.4213 81.008,78.1403 L81.008,79.152 C81.008,85.1325 75.8127,90 69.426,90 Z M40.5,42.824 C28.691,42.824 19.086,33.2146 19.086,21.41 C19.086,9.605 28.6915,0 40.5,0 C52.3085,0 61.918,9.6016 61.918,21.414 C61.918,33.223 52.3086,42.828 40.5,42.828 L40.5,42.824 Z"
          id="Shape"
        />
      </G>
    </G>
  </Svg>
);
export default UserIcon;
