import ColorGenerator from '../../utils/services/ColorGenerator';
import './TagBullet.scss';

interface TagBulletProps {
  tag: string;
  colorGenerator: ColorGenerator;
}

const TagBullet = ({ tag, colorGenerator }: TagBulletProps) => (
  <div
    style={{ backgroundColor: colorGenerator.getColorForKey(tag) }}
    className="tag-bullet"
  />
);

export default TagBullet;
