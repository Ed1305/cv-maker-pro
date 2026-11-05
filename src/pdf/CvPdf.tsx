import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { CvBlock, CvDocument } from '../cv/document';

/**
 * Vector PDF rendering of a CvDocument.
 *
 * Unlike the old html2canvas approach this produces real, selectable text,
 * clickable links and proper page breaks, so applicant tracking systems can
 * read it and the file stays small. Keep sizes in sync with the `.cv-*`
 * rules in styles.css (both use pt).
 */

const INK = '#111111';
const TEXT = '#444444';
const MUTED = '#555555';
const LINK = '#1d4ed8';

const createStyles = (fontFamily: string) =>
  StyleSheet.create({
    page: { paddingVertical: 40, paddingHorizontal: 48, fontFamily, fontSize: 9.5, lineHeight: 1.45, color: TEXT },
    name: { fontSize: 24, fontWeight: 700, textAlign: 'center', color: INK, lineHeight: 1.15 },
    title: { fontSize: 11, color: MUTED, textAlign: 'center', marginTop: 4 },
    contacts: { fontSize: 9, color: MUTED, textAlign: 'center', marginTop: 8 },
    contactLink: { color: MUTED, textDecoration: 'none' },
    rule: { height: 0.75, backgroundColor: '#cfcfcf', marginTop: 14, marginBottom: 16 },
    section: { marginBottom: 14 },
    sectionTitle: {
      fontSize: 10.5,
      fontWeight: 700,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      color: INK,
      marginBottom: 6,
    },
    entry: { marginBottom: 9 },
    entryHeading: { fontWeight: 700, color: '#222222' },
    entryTitle: { fontWeight: 700, color: '#222222', marginBottom: 1.5 },
    bulletRow: { flexDirection: 'row' },
    bulletMark: { width: 9 },
    bulletText: { flex: 1 },
    list: { flexDirection: 'row', flexWrap: 'wrap' },
    listItem: { width: '50%', flexDirection: 'row', paddingRight: 12 },
    link: { color: LINK, textDecoration: 'none' },
  });

type Styles = ReturnType<typeof createStyles>;

const Bullet = ({ text, styles }: { text: string; styles: Styles }) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bulletMark}>•</Text>
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

const Block = ({ block, styles }: { block: CvBlock; styles: Styles }) => {
  switch (block.kind) {
    case 'text':
      return <Text>{block.text}</Text>;
    case 'list':
      return (
        <View style={styles.list}>
          {block.items.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bulletMark}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      );
    case 'entries':
      return (
        <>
          {block.entries.map((entry, index) => (
            <View key={index} style={styles.entry}>
              {/* Keep the heading lines together and with at least one line after them. */}
              <View wrap={false} minPresenceAhead={24}>
                {entry.heading ? <Text style={styles.entryHeading}>{entry.heading}</Text> : null}
                {entry.title ? <Text style={styles.entryTitle}>{entry.title}</Text> : null}
              </View>
              {entry.body ? <Text>{entry.body}</Text> : null}
              {entry.bullets.map((bullet, i) => (
                <Bullet key={i} text={bullet} styles={styles} />
              ))}
              {entry.links.length > 0 ? (
                <Text>
                  {entry.links.map((link, i) => (
                    <Text key={link.href}>
                      {i > 0 ? ' · ' : ''}
                      <Link src={link.href} style={styles.link}>
                        {link.text}
                      </Link>
                    </Text>
                  ))}
                </Text>
              ) : null}
            </View>
          ))}
        </>
      );
  }
};

export interface CvPdfProps {
  doc: CvDocument;
  /** Registered font family; Helvetica is built in and used in tests. */
  fontFamily?: string;
  keywords?: string[];
}

const CvPdf = ({ doc, fontFamily = 'Helvetica', keywords = [] }: CvPdfProps) => {
  const styles = createStyles(fontFamily);
  const name = doc.name || 'CV';

  return (
    <Document
      title={`${name} – CV`}
      author={doc.name || undefined}
      subject={doc.title || 'Curriculum vitae'}
      keywords={keywords.join(', ')}
      creator="CV Maker Pro"
      producer="CV Maker Pro"
      language="en"
    >
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.name}>{name}</Text>
          {doc.title ? <Text style={styles.title}>{doc.title}</Text> : null}
          {doc.contacts.length > 0 ? (
            <Text style={styles.contacts}>
              {doc.contacts.map((contact, index) => (
                <Text key={`${contact.text}-${index}`}>
                  {index > 0 ? '  ·  ' : ''}
                  {contact.href ? (
                    <Link src={contact.href} style={styles.contactLink}>
                      {contact.text}
                    </Link>
                  ) : (
                    contact.text
                  )}
                </Text>
              ))}
            </Text>
          ) : null}
        </View>
        <View style={styles.rule} />
        {doc.sections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={40}>
              {section.title}
            </Text>
            <Block block={section.block} styles={styles} />
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default CvPdf;
