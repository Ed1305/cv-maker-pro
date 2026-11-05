import { useId, type ReactNode } from 'react';
import { ArrowDownIcon, ArrowUpIcon, ChevronIcon, TrashIcon } from './icons';

interface ItemCardProps {
  title: string;
  subtitle?: string;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  children: ReactNode;
}

/** A collapsible card for one list entry (a job, a degree, a project…). */
const ItemCard = ({ title, subtitle, expanded, onToggle, onRemove, onMoveUp, onMoveDown, children }: ItemCardProps) => {
  const bodyId = useId();
  return (
    <div className={`item-card${expanded ? ' expanded' : ''}`}>
      <div className="item-card-header">
        <button
          type="button"
          className="item-card-toggle"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={onToggle}
        >
          <span className="item-card-info">
            <span className="item-card-title">{title}</span>
            {subtitle && <span className="item-card-subtitle">{subtitle}</span>}
          </span>
          <span className={`chevron${expanded ? ' open' : ''}`}>
            <ChevronIcon />
          </span>
        </button>
        <div className="item-card-actions">
          {onMoveUp && (
            <button
              type="button"
              className="btn-icon"
              onClick={onMoveUp}
              aria-label={`Move ${title} up`}
              title="Move up"
            >
              <ArrowUpIcon />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              className="btn-icon"
              onClick={onMoveDown}
              aria-label={`Move ${title} down`}
              title="Move down"
            >
              <ArrowDownIcon />
            </button>
          )}
          <button
            type="button"
            className="btn-icon btn-delete"
            onClick={onRemove}
            aria-label={`Delete ${title}`}
            title="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      {expanded && (
        <div id={bodyId} className="item-card-body">
          {children}
        </div>
      )}
    </div>
  );
};

export default ItemCard;
