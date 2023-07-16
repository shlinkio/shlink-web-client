import type { ColorGenerator } from '../../../utils/services/ColorGenerator';
import './TagBullet.scss';

interface TagBulletProps {
  tag: string;
  colorGenerator: ColorGenerator;
}

export const TagBullet = ({ tag, colorGenerator }: TagBulletProps) => (
  <div
    style={{ backgroundColor: colorGenerator.getColorForKey(tag) }}
    className="tag-bullet"
  />
);
