import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInput from './ChatInput';

describe('ChatInput', () => {
  test('submits a trimmed message on Enter and clears the field', async () => {
    const user = userEvent.setup();
    const onSend = jest.fn();

    render(<ChatInput loading={false} onSend={onSend} />);

    const input = screen.getByLabelText(/chat message input/i);
    await user.type(input, '  Hello world  {enter}');

    expect(onSend).toHaveBeenCalledWith('Hello world');
    expect(input).toHaveValue('');
  });

  test('disables input and submit interactions while loading', () => {
    render(<ChatInput loading={true} onSend={jest.fn()} />);

    expect(screen.getByLabelText(/chat message input/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
  });
});
