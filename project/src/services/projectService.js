import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const createProject = async (projectData) => {
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      createdAt: Timestamp.now(),
      startDate: Timestamp.fromDate(projectData.startDate),
      endDate: Timestamp.fromDate(projectData.endDate),
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getProjects = async () => {
  try {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        createdAt: data.createdAt.toDate(),
      };
    });
  } catch (error) {
    throw error;
  }
};

export const getProjectById = async (id) => {
  try {
    const docRef = doc(db, 'projects', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        createdAt: data.createdAt.toDate(),
      };
    }
    
    return null;
  } catch (error) {
    throw error;
  }
};

export const subscribeToProject = (id, callback) => {
  const docRef = doc(db, 'projects', id);
  
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      const project = {
        id: doc.id,
        ...data,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        createdAt: data.createdAt.toDate(),
      };
      callback(project);
    } else {
      callback(null);
    }
  });
};

export const backProject = async (projectId, backer, amount) => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    const projectDoc = await getDoc(projectRef);
    
    if (projectDoc.exists()) {
      const currentData = projectDoc.data();
      await updateDoc(projectRef, {
        backers: arrayUnion({
          ...backer,
          backedAt: Timestamp.fromDate(backer.backedAt),
        }),
        currentFunding: currentData.currentFunding + amount,
      });
    }
  } catch (error) {
    throw error;
  }
};

export const addComment = async (projectId, comment) => {
  try {
    const projectRef = doc(db, 'projects', projectId);
    await updateDoc(projectRef, {
      comments: arrayUnion({
        ...comment,
        id: Date.now().toString(),
        createdAt: Timestamp.now(),
      }),
    });
  } catch (error) {
    throw error;
  }
};