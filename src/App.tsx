import { useRef } from 'react';
import { Slider } from './components/slider';
import { SliderRef } from '@components/slider/types';

function App() {
  const slideRef = useRef<SliderRef | null>(null);

  return (
    <>
      <Slider indicatorsPosition="left" touchable autoPlay duration={300} ref={slideRef}>
        {['blue', 'red', 'yellow', 'purple', 'green', 'pink'].map((o, index) => (
          <div
            style={{
              width: '100%',
              height: '500px',
              background: o,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontSize: '150%'
            }}
            key={o}
          >
            {index}
          </div>
        ))}
      </Slider>
      <button
        onClick={() => {
          slideRef.current?.swipeTo(1);
        }}
      >
        测试
      </button>
    </>
  );
}

export default App;
