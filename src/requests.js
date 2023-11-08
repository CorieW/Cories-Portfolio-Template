import firebase from './firebase.js';

async function fetchAboutMe() {
    const db = firebase.firestore();
    const aboutMeRef = db.collection('general').doc('about-me');

    let profileImgUrl = '';
    let headerText = '';
    let infoText = '';

    try {
        const doc = await aboutMeRef.get();
        const aboutMe = doc.data();

        if (aboutMe) {
            headerText = aboutMe.header;
            infoText = aboutMe.desc;
            const storeProfileImgPath = aboutMe.profileImgPath;

            const storageRef = firebase.storage().ref();
            const profileImgRef = storageRef.child(storeProfileImgPath);
            profileImgUrl = await profileImgRef.getDownloadURL();
        }
    } catch (error) {
        console.error('Error fetching about me:', error);
    }

    return {
        profileImgUrl,
        headerText,
        infoText
    };
}

async function fetchSkills() {
    const db = firebase.firestore();
    const skillsRef = db.collection('skills').orderBy('priority', 'desc');
    const storageRef = firebase.storage().ref();

    const skillsCategories = [];

    try {
        const querySnapshot = await skillsRef.get();

        for (const doc of querySnapshot.docs) {
            const skillsCategory = doc.data();
            const getImageURLPromises = skillsCategory.skills.map(async (skill) => {
                try {
                    const imageRef = storageRef.child(skill.imageURL);
                    const url = await imageRef.getDownloadURL();
                    // If skill is not writable, create a new object
                    return { ...skill, imageURL: url };
                } catch (error) {
                    console.error('Error retrieving image URL:', error);
                    return skill; // Return the original skill if there's an error
                }
            });

            skillsCategory.skills = await Promise.all(getImageURLPromises);
            skillsCategories.push(skillsCategory);
        }
    } catch (error) {
        console.error('Error fetching skills:', error);
    }

    return {
        skillsCategories
    };
}

async function fetchSkills2() {
    const db = firebase.firestore();
    const skillsRef = db.collection('general').doc('skills');
    const storageRef = firebase.storage().ref();

    let skills = [];

    try {
        const doc = await skillsRef.get();
        const skillsData = doc.data();

        if (skillsData) {
            const getImageURLPromises = skillsData.data.map(async (skill) => {
                try {
                    const imageRef = storageRef.child(skill.imageURL);
                    const url = await imageRef.getDownloadURL();
                    // If skill is not writable, create a new object
                    return { ...skill, imageURL: url };
                } catch (error) {
                    console.error('Error retrieving image URL:', error);
                    return skill; // Return the original skill if there's an error
                }
            });

            skills = await Promise.all(getImageURLPromises);
            console.log('skills', skills);
        }
    } catch (error) {
        console.error('Error fetching skills:', error);
    }

    return skills;
}

async function fetchProjects() {
    const db = firebase.firestore();
    const projectsRef = db.collection('projects');

    const projects = [];

    try {
        const querySnapshot = await projectsRef.get();

        querySnapshot.forEach((doc) => {
            projects.push(doc.data());
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
    }

    return {
        projects
    };
}

async function fetchContactInfo() {
    const db = firebase.firestore();
    const contactInfoRef = db.collection('general').doc('contact');

    let data = null;

    try {
        const doc = await contactInfoRef.get();
        const contact = doc.data();

        if (contact) {
            data = contact;
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
    fetchSkills2,
    fetchProjects,
    fetchContactInfo,
    fetchSocialMedias
};