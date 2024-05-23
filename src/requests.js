import firebase from './firebase.js';

async function fetchImageFromStorage(imageURL) {
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child(imageURL);

    try {
        const url = await imageRef.getDownloadURL();
        return url;
    } catch (error) {
        console.error('Error fetching image from storage:', error);
        return null;
    }
}

async function fetchAboutMe() {
    const db = firebase.firestore();
    const aboutMeRef = db.collection('general').doc('about-me');

    let profileImgURL = '';
    let headerText = '';
    let infoText = '';

    try {
        const doc = await aboutMeRef.get();
        const aboutMe = doc.data();

        if (aboutMe) {
            headerText = aboutMe.header;
            infoText = aboutMe.desc;
            profileImgURL = await fetchImageFromStorage(aboutMe.profileImgURL);
        }
    } catch (error) {
        console.error('Error fetching about me:', error);
    }

    return {
        profileImgURL,
        headerText,
        infoText,
    };
}

async function fetchSkills() {
    const db = firebase.firestore();
    const skillsRef = db.collection('general').doc('skills');

    let skills = [];

    try {
        const doc = await skillsRef.get();
        const skillsData = doc.data();

        if (skillsData) {
            const getImageURLPromises = skillsData.data.map(async (skill) => {
                try {
                    const url = await fetchImageFromStorage(skill.imageURL);
                    return { ...skill, imageURL: url };
                } catch (error) {
                    console.error('Error retrieving image URL:', error);
                    return skill;
                }
            });

            // This will get each skill with it's loaded image URL
            skills = await Promise.all(getImageURLPromises);
        }
    } catch (error) {
        console.error('Error fetching skills:', error);
    }

    return skills;
}

/**
 * @param {boolean} production - If true, only fetch projects that are meant for production
 */
async function fetchProjects(production = false) {
    const db = firebase.firestore();
    const projectsRef = db.collection('general').doc('projects');

    let projects = [];

    try {
        const doc = await projectsRef.get();
        const projectsData = doc.data();

        if (!projectsData) return projects;

        let neededProjects = [];
        neededProjects = projectsData.data.map((project) => {
            return {
                ...project,
                isTest: project.isTest || false,
            };
        });

        // Remove projects that are not in production when in production mode
        if (production) {
            neededProjects = neededProjects.filter(
                (project) => project.isTest === false
            );
        }

        const getImageURLPromises = neededProjects.map(async (project) => {
            try {
                const url = await fetchImageFromStorage(project.showcaseImgURL);
                return { ...project, showcaseImgURL: url };
            } catch (error) {
                console.error('Error retrieving image URL:', error);
                return project;
            }
        });

        // This will get each project with it's loaded image URL
        projects = await Promise.all(getImageURLPromises);
    } catch (error) {
        console.error('Error fetching projects:', error);
    }

    return projects;
}

async function fetchContactInfo() {
    const db = firebase.firestore();
    const contactInfoRef = db.collection('general').doc('contact');

    let data = null;

    try {
        const doc = await contactInfoRef.get();
        const contact = doc.data();

        if (contact) {
            data = contact.info;
        }
    } catch (error) {
        console.error('Error fetching contact info:', error);
    }

    return data;
}

async function fetchSocialMedias() {
    const db = firebase.firestore();
    const socialMediasRef = db.collection('general').doc('social-medias');

    let data = null;

    try {
        const doc = await socialMediasRef.get();
        const socialMedias = doc.data();

        if (socialMedias) {
            data = socialMedias.data;
        }
    } catch (error) {
        console.error('Error fetching social medias:', error);
    }

    return data;
}

export default {
    fetchAboutMe,
    fetchSkills,
    fetchProjects,
    fetchContactInfo,
    fetchSocialMedias,
};
