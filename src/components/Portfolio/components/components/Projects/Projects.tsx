import './Projects.scss';
import {
    IExternalProjectShowcase,
    IInternalProjectShowcase,
    IProject,
} from '../../../../../ts/IProject';
import Slideshow from '../../../../Slideshow/Slideshow';
import IProjectsSlideshowSettings from '../../../../../ts/IProjectsSlideshowSettings';

type Props = {
    settings?: IProjectsSlideshowSettings | null;
    projects: IProject[];
};

function Projects(props: Props) {
    const { settings, projects } = props;

    const internalProjectShowcaseJSX = (
        showcase: IInternalProjectShowcase,
        index: number
    ) => {
        return (
            <div className='internal-project-showcase' key={index}>
                {showcase.component}
            </div>
        );
    };

    const externalProjectShowcaseJSX = (
        showcase: IExternalProjectShowcase,
        index: number
    ) => {
        return (
            <>
                <iframe
                    src={showcase.url}
                    title={showcase.title + ' Project Showcase'}
                    className='project-showcase-iframe'
                    key={index}
                ></iframe>
                <div className='iframe-overlay'></div>
            </>
        );
    };

    const projectJSX = (project: IProject, index: number) => {
        const isInternal =
            (project.showcase as IExternalProjectShowcase).url === undefined;

        return isInternal
            ? internalProjectShowcaseJSX(
                  project.showcase as IInternalProjectShowcase,
                  index
              )
            : externalProjectShowcaseJSX(
                  project.showcase as IExternalProjectShowcase,
                  index
              );
    };

    function getSlides() {
        return projects.map((project, index) => {
            return {
                element: projectJSX(project, index)
            };
        });
    }

    return (
        <div id='projects-container'>
            <Slideshow
                slides={getSlides()}
                autoTransition={settings?.autoTransition}
                transitionTime={settings?.transitionTime}
            />
        </div>
    );
}

export default Projects;
