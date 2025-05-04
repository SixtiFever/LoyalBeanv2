import { SVGIconProps } from "@/types/SVGIconProps";
import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
const PlusIcon: React.FC<SVGIconProps> = ({...props}) => (
  <Svg
    width={ props.width ? `${props.width}px` : "80px"}
    height={ props.height ? `${props.height}px` : "80px"}
    viewBox="0 0 80 80"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <G id="Web" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <G id="noun-plus-3796374" fill={`${props.color ?? 'black'}`} fillRule="nonzero">
        <Path
          d="M40,0 C17.9438477,0 0,17.9438477 0,40 C0,62.0561523 17.9438477,80 40,80 C62.0561523,80 80,62.0561523 80,40 C80,17.9438477 62.0561523,0 40,0 Z M40,78 C19.046875,78 2,60.953125 2,40 C2,19.046875 19.046875,2 40,2 C60.953125,2 78,19.046875 78,40 C78,60.953125 60.953125,78 40,78 Z"
          id="Shape"
        />
        <Path
          d="M61.84375,39 L41,39 L41,18.15625 C41,17.6040039 40.5522461,17.15625 40,17.15625 C39.4477539,17.15625 39,17.6040039 39,18.15625 L39,39 L18.15625,39 C17.6040039,39 17.15625,39.4477539 17.15625,40 C17.15625,40.5522461 17.6040039,41 18.15625,41 L39,41 L39,61.84375 C39,62.3959961 39.4477539,62.84375 40,62.84375 C40.5522461,62.84375 41,62.3959961 41,61.84375 L41,41 L61.84375,41 C62.3959961,41 62.84375,40.5522461 62.84375,40 C62.84375,39.4477539 62.3959961,39 61.84375,39 Z"
          id="Path"
        />
      </G>
    </G>
  </Svg>
);
export default PlusIcon;
