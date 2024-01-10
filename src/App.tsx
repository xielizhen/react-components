import { Slider } from './components/slider';

function App() {
  return (
    <>
      <Slider indicatorsPosition="left" autoPlay duration={300}>
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
            {index + 1}
          </div>
        ))}
      </Slider>
    </>
  );
}

export default App;
