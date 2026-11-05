import { Fragment } from 'react';
import type { CvBlock, CvDocument, CvLink } from '../../cv/document';

/**
 * HTML rendering of a CvDocument for the on-screen preview.
 * Sizes are in pt in styles.css so they match the PDF (src/pdf/CvPdf.tsx).
 */

const Contact = ({ link }: { link: CvLink }) =>
  link.href ? (
    <a href={link.href} target="_blank" rel="noreferrer">
      {link.text}
    </a>
  ) : (
    <span>{link.text}</span>
  );

const Block = ({ block }: { block: CvBlock }) => {
  switch (block.kind) {
    case 'text':
      return <p className="cv-text">{block.text}</p>;
    case 'list':
      return (
        <ul className="cv-list">
          {block.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    case 'entries':
      return (
        <>
          {block.entries.map((entry, index) => (
            <div key={index} className="cv-entry">
              {entry.heading && <p className="cv-entry-heading">{entry.heading}</p>}
              {entry.title && <p className="cv-entry-title">{entry.title}</p>}
              {entry.body && <p className="cv-text">{entry.body}</p>}
              {entry.bullets.length > 0 && (
                <ul className="cv-bullets">
                  {entry.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
              {entry.links.length > 0 && (
                <p className="cv-links">
                  {entry.links.map((link, i) => (
                    <Fragment key={link.href}>
                      {i > 0 && ' · '}
                      <a href={link.href} target="_blank" rel="noreferrer">
                        {link.text}
                      </a>
                    </Fragment>
                  ))}
                </p>
              )}
            </div>
          ))}
        </>
      );
  }
};

const CvSheet = ({ doc }: { doc: CvDocument }) => (
  <article className="cv-sheet" aria-label="CV preview">
    <header className="cv-header">
      <h1 className={doc.name ? undefined : 'cv-placeholder'}>{doc.name || 'Your Name'}</h1>
      {doc.title && <p className="cv-title">{doc.title}</p>}
      {doc.contacts.length > 0 && (
        <p className="cv-contacts">
          {doc.contacts.map((link, index) => (
            <Fragment key={`${link.text}-${index}`}>
              {index > 0 && <span className="cv-sep"> · </span>}
              <Contact link={link} />
            </Fragment>
          ))}
        </p>
      )}
    </header>
    <div className="cv-rule" />
    {doc.sections.map((section) => (
      <section key={section.id} className="cv-section">
        <h2>{section.title}</h2>
        <Block block={section.block} />
      </section>
    ))}
  </article>
);

export default CvSheet;
