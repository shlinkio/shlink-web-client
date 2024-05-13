import axe from 'axe-core';

type ContainerWrapper = { container: HTMLElement };

type AccessibilityTestSubject = ContainerWrapper | Promise<ContainerWrapper>;

export const checkAccessibility = async (subject: AccessibilityTestSubject) => {
  const { container } = await subject;
  const { violations } = await axe.run(container);

  expect(violations).toStrictEqual([]);
};
