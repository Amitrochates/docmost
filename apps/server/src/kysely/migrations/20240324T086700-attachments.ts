import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('attachments')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('file_name', 'varchar', (col) => col.notNull())
    .addColumn('file_path', 'varchar', (col) => col.notNull())
    .addColumn('file_size', 'int8', (col) => col)
    .addColumn('file_ext', 'varchar', (col) => col.notNull())
    .addColumn('mime_type', 'varchar', (col) => col)
    .addColumn('type', 'varchar', (col) => col)
    .addColumn('creator_id', 'uuid', (col) =>
      col.references('users.id').notNull(),
    )
    .addColumn('page_id', 'uuid', (col) => col.references('pages.id'))
    .addColumn('space_id', 'uuid', (col) => col.references('spaces.id'))
    .addColumn('workspace_id', 'uuid', (col) => col.references('workspaces.id'))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('deleted_at', 'timestamptz', (col) => col)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('attachments').execute();
}
