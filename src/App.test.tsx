import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const renderApp = () => {
  localStorage.clear();
  const user = userEvent.setup();
  render(<App />);
  return user;
};

const preview = () => within(screen.getByRole('article', { name: 'CV preview' }));

describe('App', () => {
  it('shows typed details in the live preview', async () => {
    const user = renderApp();
    await user.type(screen.getByLabelText(/full name/i), 'Ada Lovelace');
    expect(await preview().findByRole('heading', { name: 'Ada Lovelace' })).toBeInTheDocument();
  });

  it('shows an email error only after leaving the field', async () => {
    const user = renderApp();
    const email = screen.getByLabelText(/^email/i);
    await user.type(email, 'ada@');
    expect(screen.queryByText(/looks incomplete/i)).not.toBeInTheDocument();
    await user.tab();
    expect(screen.getByText(/looks incomplete/i)).toBeInTheDocument();
    expect(email).toHaveAttribute('aria-invalid', 'true');
  });

  it('lets the user delete a job and undo it', async () => {
    const user = renderApp();
    await user.click(screen.getByRole('button', { name: /^Step 3:\s*Sections/ }));
    await user.click(screen.getByRole('button', { name: 'Edit Work Experience' }));
    await user.click(screen.getByRole('button', { name: /add work experience/i }));
    await user.type(screen.getByLabelText(/job title/i), 'Lead Engineer');

    await user.click(screen.getByRole('button', { name: 'Delete Lead Engineer' }));
    expect(screen.queryByLabelText(/job title/i)).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Deleted "Lead Engineer"');

    await user.click(within(screen.getByRole('status')).getByRole('button', { name: 'Undo' }));
    expect(screen.getByRole('button', { name: 'Delete Lead Engineer' })).toBeInTheDocument();
  });

  it('reorders sections and the preview follows', async () => {
    const user = renderApp();
    await user.type(screen.getByLabelText(/full name/i), 'Ada');
    await user.click(screen.getByRole('button', { name: /^Step 3:\s*Sections/ }));
    await user.click(screen.getByRole('button', { name: /^Languages/ }));
    await user.click(screen.getByRole('button', { name: /add language/i }));
    await user.type(screen.getByLabelText('Language 1'), 'French');
    await user.click(screen.getByRole('button', { name: /all sections/i }));
    await user.click(screen.getByRole('button', { name: 'Move Languages up' }));
    const headings = preview()
      .getAllByRole('heading', { level: 2 })
      .map((h) => h.textContent);
    expect(headings).toEqual(['Languages']);
    const onCv = within(screen.getByRole('list', { name: /on your cv/i })).getAllByRole('listitem');
    // Defaults are Experience, Education, Skills; Languages was added 4th and moved up once.
    expect(onCv.map((li) => li.textContent?.match(/^[A-Z][a-z]+( [A-Z][a-z]+)?/)?.[0])).toEqual([
      'Work Experience',
      'Education',
      'Languages',
      'Skills',
    ]);
  });

  it('review step reports missing details and links to them', async () => {
    const user = renderApp();
    await user.click(screen.getByRole('button', { name: /^Step 4:\s*Review/ }));
    expect(screen.getByText(/personal details: add your name/i)).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Go to it' })[0]);
    expect(screen.getByRole('heading', { name: 'Your details' })).toBeInTheDocument();
  });
});
