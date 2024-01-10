import { BaseTypeProps } from '../../interfaces/common';

export interface SliderProps extends BaseTypeProps {
  /** 初始位置索引值 */
  initialSwipe?: number;
  /** 是否允许手势滑动 */
  touchable?: boolean;
  /** 自动轮播间隔，单位为 ms */
  autoPlay?: boolean | number;
  /** 是否开启循环播放 */
  loop?: boolean;
  /** 动画时长 */
  duration?: number;
  /** 指示器位置 */
  indicatorsPosition?: 'top' | 'bottom' | 'left' | 'right';
  /** 左右切换按钮 */
  showDots?: boolean;
  /** 滑块的宽度百分比 */
  slideSize?: number; // 暂时不实现，二期在实现这个功能
  /** 每一页轮播结束后触发 */
  onChange?: (slideNumber: number) => void;
  indicators?: boolean;
  children: React.ReactNode;
}

export type SliderRef = {
  swipeTo: (index: number) => void;
  swipeNext: () => void;
  swipePrev: () => void;
  activeIndex: number;
};
