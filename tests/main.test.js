/**
 * @jest-environment jsdom
 */

const { playSound, removeTransition, keyCode } = require('../src/main');

describe('Piano keys functionality', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="key" data-key="65">A</div>
      <audio data-key="65"></audio>
      <div class="key" data-key="83">S</div>
      <audio data-key="83"></audio>
    `;
  });

  test('should select all elements with class "key"', () => {
    const keys = Array.from(document.querySelectorAll('.key'));
    expect(keys.length).toBe(2);
    expect(keys[0].getAttribute('data-key')).toBe('65');
    expect(keys[1].getAttribute('data-key')).toBe('83');
  });

  test('should remove "playing" class from all keys on keyup', () => {
    const keys = Array.from(document.querySelectorAll('.key'));
    keys.forEach((key) => key.classList.add('playing')); // Add playing class before keyup event
  
    const keyupEvent = new Event('keyup');
    document.dispatchEvent(keyupEvent); // Dispatch the event
  
    // Re-fetch keys after dispatching the event to ensure they're updated
    const updatedKeys = Array.from(document.querySelectorAll('.key'));
    updatedKeys.forEach((key) => {
      expect(key.classList.contains('playing')).toBe(false);
    });
  });
  
  test('should add "playing" class and play sound on valid key press', () => {
    const audio = document.querySelector('audio[data-key="65"]');
    const key = document.querySelector('div[data-key="65"]');

    jest.spyOn(audio, 'play').mockImplementation(() => {});

    const event = new KeyboardEvent('keydown', { keyCode: 65 });
    playSound(event);

    expect(key.classList.contains('playing')).toBe(true);
    expect(audio.play).toHaveBeenCalled();
  });

  test('should do nothing when invalid key is pressed', () => {
    const key = document.querySelector('div[data-key="65"]');

    const event = new KeyboardEvent('keydown', { keyCode: 90 }); // Invalid key (Z)
    playSound(event);

    expect(key.classList.contains('playing')).toBe(false);
  });

  test('should remove "playing" class after transition ends', () => {
    const key = document.querySelector('div[data-key="65"]');
    key.classList.add('playing');

    const event = new Event('transitionend');
    Object.defineProperty(event, 'propertyName', { value: 'transform' });
    Object.defineProperty(event, 'target', { value: key }); // Mock the target

    removeTransition(event); // Call the function

    expect(key.classList.contains('playing')).toBe(false); // Check if the class is removed
  });

  test('should add "playing" class and play sound on key click', () => {
    const key = document.querySelector('div[data-key="65"]');
    const audio = document.querySelector('audio[data-key="65"]');
    
    jest.spyOn(audio, 'play').mockImplementation(() => {});
  
    const clickEvent = new MouseEvent('click', { bubbles: true }); // Dispatch the click event
    key.dispatchEvent(clickEvent); // Trigger the click event
  
    expect(key.classList.contains('playing')).toBe(true); // Check if 'playing' class is added
    expect(audio.play).toHaveBeenCalled(); // Check if audio.play() was called
  });
  
});
