import { screen } from '@testing-library/react';
import { DeleteTagConfirmModal } from '../../../src/tags/helpers/DeleteTagConfirmModal';
import { TagDeletion } from '../../../src/tags/reducers/tagDelete';
import { renderWithEvents } from '../../__helpers__/setUpTest';

describe('<DeleteTagConfirmModal />', () => {
  const tag = 'nodejs';
  const deleteTag = jest.fn();
  const tagDeleted = jest.fn();
  const setUp = (tagDelete: TagDeletion) => renderWithEvents(
    <DeleteTagConfirmModal
      tag={tag}
      toggle={() => ''}
      isOpen
      deleteTag={deleteTag}
      tagDeleted={tagDeleted}
      tagDelete={tagDelete}
    />,
  );

  afterEach(jest.resetAllMocks);

  it('asks confirmation for provided tag to be deleted', () => {
    setUp({ error: false, deleting: false });

    const delBtn = screen.getByRole('button', { name: 'Delete tag' });

    expect(screen.getByText(/^Are you sure you want to delete tag/)).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong while deleting the tag :(')).not.toBeInTheDocument();
    expect(delBtn).toBeInTheDocument();
    expect(delBtn).not.toHaveClass('disabled');
    expect(delBtn).not.toHaveAttribute('disabled');
  });

  it('shows error message when deletion failed', () => {
    setUp({ error: true, deleting: false });
    expect(screen.getByText('Something went wrong while deleting the tag :(')).toBeInTheDocument();
  });

  it('shows loading status while deleting', () => {
    setUp({ error: false, deleting: true });

    const delBtn = screen.getByRole('button', { name: 'Deleting tag...' });

    expect(delBtn).toBeInTheDocument();
    expect(delBtn).toHaveClass('disabled');
    expect(delBtn).toHaveAttribute('disabled');
  });

  it('hides tag modal when btn is clicked', async () => {
    const { user } = setUp({ error: false, deleting: false });

    await user.click(screen.getByRole('button', { name: 'Delete tag' }));

    expect(deleteTag).toHaveBeenCalledTimes(1);
    expect(deleteTag).toHaveBeenCalledWith(tag);
    expect(tagDeleted).toHaveBeenCalledTimes(1);
    expect(tagDeleted).toHaveBeenCalledWith(tag);
  });

  it('does no further actions when modal is closed without deleting tag', async () => {
    const { user } = setUp({ error: false, deleting: false });

    await user.click(screen.getByLabelText('Close'));

    expect(deleteTag).not.toHaveBeenCalled();
    expect(tagDeleted).not.toHaveBeenCalled();
  });
});
