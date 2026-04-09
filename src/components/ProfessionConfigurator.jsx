import { useMemo, useState } from 'react';
import { useProfession } from '../context/ProfessionContext';
import { PROFESSION_TREES } from '../data/professions';

function prettyLabel(value) {
  if (!value) return 'None';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function SkillRow({ skill, tree, value, onSet }) {
  const level10Options = value.level5 ? (tree.level10[value.level5] || []) : [];

  return (
    <div className="prof-skill">
      <div className="prof-skill-name">{prettyLabel(skill)}</div>
      <div className="prof-skill-grid">
        <label>
          <span>Lv 5</span>
          <select
            value={value.level5 || ''}
            onChange={(e) => onSet(skill, e.target.value || null, null)}
          >
            <option value="">None</option>
            {tree.level5.map((opt) => (
              <option key={opt} value={opt}>{prettyLabel(opt)}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Lv 10</span>
          <select
            value={value.level10 || ''}
            disabled={!value.level5}
            onChange={(e) => onSet(skill, value.level5, e.target.value || null)}
          >
            <option value="">None</option>
            {level10Options.map((opt) => (
              <option key={opt} value={opt}>{prettyLabel(opt)}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export default function ProfessionConfigurator() {
  const [open, setOpen] = useState(false);
  const { selection, setSkillSelection, resetSelection } = useProfession();

  const activeCount = useMemo(
    () => Object.values(selection).reduce((acc, s) => acc + (s.level5 ? 1 : 0) + (s.level10 ? 1 : 0), 0),
    [selection],
  );

  return (
    <div className="profession-fab-wrap">
      <button className="profession-fab" onClick={() => setOpen((v) => !v)}>
        Professions ({activeCount})
      </button>

      {open && (
        <>
          <div className="profession-backdrop" onClick={() => setOpen(false)} />
          <div className="profession-popout">
            <div className="profession-popout-head">
              <h3>Profession Setup</h3>
              <button className="profession-close" onClick={() => setOpen(false)} aria-label="Close professions panel">×</button>
            </div>

            <div className="profession-popout-body">
              {Object.entries(PROFESSION_TREES).map(([skill, tree]) => (
                <SkillRow
                  key={skill}
                  skill={skill}
                  tree={tree}
                  value={selection[skill]}
                  onSet={setSkillSelection}
                />
              ))}

              <div className="profession-actions">
                <button className="abtn" onClick={resetSelection}>Reset All</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
