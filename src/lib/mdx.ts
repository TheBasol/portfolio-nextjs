import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const rootDirectory = process.cwd();
const notesDirectory = path.join(rootDirectory, 'src/content/notes');

export type NoteFrontmatter = {
  title: string;
  date: string;
  description: string;
  tags?: string[];
};

export type Note = {
  slug: string[];
  subject: string;
  frontmatter: NoteFrontmatter;
  content: string;
};

/**
 * Ensures the notes directory exists.
 */
function ensureNotesDirectory() {
  if (!fs.existsSync(notesDirectory)) {
    fs.mkdirSync(notesDirectory, { recursive: true });
  }
}

/**
 * Recursively find all MDX files in a directory.
 */
function walkDir(dir: string, fileList: string[] = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath, fileList);
    } else if (file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

/**
 * Retrieves all notes from the content directory, sorted by date.
 */
export function getNotes(): Omit<Note, 'content'>[] {
  ensureNotesDirectory();
  
  const mdxFiles = walkDir(notesDirectory);

  const notes = mdxFiles.map((filePath) => {
    // Get relative path like "bases-de-datos/sql.mdx"
    const relativePath = path.relative(notesDirectory, filePath);
    // Split into slug parts: ['bases-de-datos', 'sql']
    const slugParts = relativePath.replace('.mdx', '').split(path.sep);
    
    // The subject is the first folder. If no folder, it's 'General'
    const subject = slugParts.length > 1 ? slugParts[0] : 'General';
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);

    return {
      slug: slugParts,
      subject,
      frontmatter: data as NoteFrontmatter,
    };
  });

  // Sort notes by date in descending order
  return notes.sort((a, b) => {
    if (new Date(a.frontmatter.date) > new Date(b.frontmatter.date)) {
      return -1;
    }
    return 1;
  });
}

/**
 * Retrieves a single note by its slug array.
 */
export function getNoteBySlug(slugArray: string[]): Note | null {
  ensureNotesDirectory();
  
  try {
    const filePath = path.join(notesDirectory, ...slugArray) + '.mdx';
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    const subject = slugArray.length > 1 ? slugArray[0] : 'General';
    const { data, content } = matter(fileContent);

    return {
      slug: slugArray,
      subject,
      frontmatter: data as NoteFrontmatter,
      content,
    };
  } catch (error) {
    return null;
  }
}
