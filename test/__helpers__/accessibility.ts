import { run } from 'axe-core';

type ContainerWrapper = { container: HTMLElement };

type AccessibilityTestSubject = ContainerWrapper | Promise<ContainerWrapper>;

export const checkAccessibility = async (subject: AccessibilityTestSubject) => {
  const { container } = await subject;
  const { violations } = await run(container);

  expect(violations).toStrictEqual([]);
};
