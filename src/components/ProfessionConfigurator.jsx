import { useMemo, useState } from 'react';
import { useProfession } from '../context/ProfessionContext';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { PROFESSION_TREES } from '../data/professions';

const SKILLS = ['farming', 'fishing', 'foraging', 'mining', 'combat'];
const MAX_LEVEL = 10;

function prettyLabel(value) {
  if (!value) return 'None';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function ProfessionRow({ skill, tree, value, onSet }) {
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

function SkillLevelRow({ skill, level, onSet }) {
  return (
    <div className="prof-skill">
      <div className="skill-level-row">
        <span className="prof-skill-name">{prettyLabel(skill)}</span>
        <select
          className={level >= MAX_LEVEL ? 'skill-level-maxed' : ''}
          value={level}
          onChange={(e) => onSet(skill, Number(e.target.value))}
        >
          {Array.from({ length: MAX_LEVEL + 1 }, (_, i) => (
            <option key={i} value={i}>Lv {i}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function ProfessionConfigurator() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('skills');
  const { selection, setSkillSelection, resetSelection } = useProfession();
  const skillLevels = useCollectionStore((s) => s.skillLevels);
  const setSkillLevel = useCollectionStore((s) => s.setSkillLevel);

  const maxedSkills = useMemo(
    () => SKILLS.filter((s) => (skillLevels[s] || 0) >= MAX_LEVEL).length,
    [skillLevels],
  );

  return (
    <div className="profession-fab-wrap">
      <button className="profession-fab" onClick={() => setOpen((v) => !v)}>
        Skills &amp; Professions
      </button>

      {open && (
        <>
          <div className="profession-backdrop" onClick={() => setOpen(false)} />
          <div className="profession-popout">
            <div className="profession-popout-head">
              <h3>Character Setup</h3>
              <button className="profession-close" onClick={() => setOpen(false)} aria-label="Close panel">×</button>
            </div>

            <div className="profession-tabs">
              <button
                className={`profession-tab${tab === 'skills' ? ' active' : ''}`}
                onClick={() => setTab('skills')}
              >
                Skills ({maxedSkills}/{SKILLS.length})
              </button>
              <button
                className={`profession-tab${tab === 'professions' ? ' active' : ''}`}
                onClick={() => setTab('professions')}
              >
                Professions
              </button>
            </div>

            <div className="profession-popout-body">
              {tab === 'skills' && (
                <>
                  {SKILLS.map((skill) => (
                    <SkillLevelRow
                      key={skill}
                      skill={skill}
                      level={skillLevels[skill] || 0}
                      onSet={setSkillLevel}
                    />
                  ))}
                  <p className="prof-hint">
                    Set each skill to its in-game level. All five at Lv 10 completes the Farmer Level goal.
                  </p>
                </>
              )}

              {tab === 'professions' && (
                <>
                  {Object.entries(PROFESSION_TREES).map(([skill, tree]) => (
                    <ProfessionRow
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
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
