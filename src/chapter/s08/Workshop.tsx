import { CodeWorkshop } from '../workshop/CodeWorkshop';
import { TEMPLATES } from './content';

/** A workshop for one template of `TEMPLATES` (id = template key, prefixed so it stays unique next to other sessions). */
export function Workshop({ k, live = false }: { k: string; live?: boolean }) {
  const t = TEMPLATES[k];
  return <CodeWorkshop id={`s8-${k}`} title={t.title} template={t.code} live={live} tryOut={t.tryOut} />;
}
