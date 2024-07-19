import './Skills.scss';
import Timeline, {
    ITimelineItem,
} from '../../../../components/Timeline/Timeline';
import ISkill from '../../../../ts/ISkill';

type Props = {
    skills: ISkill[];
};

function Skills(props: Props) {
    const { skills } = props;

    /**
     * Convert skills to timeline items
     * Mostly just converting the acquired date to a number for sorting
     */
    function convertSkillsToTimelineItems(skills: ISkill[]): ITimelineItem[] {
        return skills.map((skill) => {
            // convert 'acquired' date to number such as 2021.5
            let acquired: number = 0;
            if (skill.acquiredDate) {
                const acquiredDate = skill.acquiredDate;
                acquired =
                    acquiredDate.getFullYear() +
                    acquiredDate.getMonth() / 12 +
                    acquiredDate.getDate() / 365;
            }

            return {
                name: skill.name,
                imageURL: skill.iconUrl,
                acquired,
            };
        });
    }

    return (
        <div id='skills-container'>
            <h2>Skills</h2>
            <Timeline items={convertSkillsToTimelineItems(skills)} />
        </div>
    );
}

export default Skills;
