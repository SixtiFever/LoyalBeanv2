import { SVGIconProps } from "@/types/SVGIconProps";
import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
const EmailIcon: React.FC<SVGIconProps> = ({...props}) => (
  <Svg
    width={ props.width ? `${props.width}px` : "94px"}
    height={ props.height ? `${props.height}px` : "69px"}
    viewBox="0 0 94 69"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <G id="Web" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <G
        id="noun-email-7099237"
        transform="translate(0.124500, 0.000000)"
        fill={`${props.color ?? 'black'}`}
        fillRule="nonzero"
      >
        <Path
          d="M85.9375,0 L7.8125,0 C3.5039,0 0,3.5039 0,7.8125 L0,60.9375 C0,65.2461 3.5039,68.75 7.8125,68.75 L85.9375,68.75 C90.2461,68.75 93.75,65.2461 93.75,60.9375 L93.75,7.8125 C93.75,3.5039 90.2461,0 85.9375,0 Z M83.7969,56.598 L81.8321,59.0277 L54.8281,37.1647 L53.414,38.3092 C51.5702,39.8014 49.246,40.6256 46.8749,40.6256 C44.5038,40.6256 42.1796,39.80138 40.3358,38.3092 L38.9217,37.1647 L11.9217,59.0277 L9.9529,56.598 L36.4409,35.157 L9.9529,13.716 L11.9217,11.2863 L42.3047,35.8843 C44.8828,37.9702 48.8672,37.9702 51.4453,35.8843 L81.8283,11.2903 L83.7931,13.72 L57.3051,35.161 L83.7969,56.598 Z"
          id="Shape"
        />
      </G>
    </G>
  </Svg>
);
export default EmailIcon;
