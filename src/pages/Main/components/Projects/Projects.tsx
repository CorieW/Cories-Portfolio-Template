import './Projects.scss';
import {
    IExternalProjectShowcase,
    IInternalProjectShowcase,
    IProject,
} from '../../../../ts/IProject';
import Slideshow from '../../../../components/Slideshow/Slideshow';

type Props = {
    projects: IProject[];
};

function Projects(props: Props) {
    const { projects } = props;

    const internalProjectShowcaseJSX = (showcase: IInternalProjectShowcase, index: number) => {
        return (
            <div className='internal-project-showcase' key={index}>
                {showcase.component}
            </div>
        );
    };

    const externalProjectShowcaseJSX = (showcase: IExternalProjectShowcase, index: number) => {
        return (
            <iframe
                src={showcase.url}
                title={showcase.title + ' Project Showcase'}
                className='project-showcase-iframe'
                key={index}
            ></iframe>
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
                element: projectJSX(project, index),
                backgroundColor: project.showcase.backgroundColor,
            };
        });
    }

    return (
        <div id='projects-container'>
            <Slideshow slides={getSlides()} />
        </div>
    );
}

export default Projects;
