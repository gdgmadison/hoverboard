console.log('Getting names');

import * as admin from "firebase-admin";
import * as serviceAccount from '../serviceAccount.json';
import * as fs from 'fs';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: 'https://devfest-wi.firebaseio.com'
});

const db = admin.firestore();

async function getUsers() {
  const snapshot = await db.collection('users').get();
  return snapshot.docs.reduce((acc, doc) => {
    acc[doc.id] = doc.data().displayName;
    return acc;
  }, {});
}

async function getFeedback() {
  const snapshot = await db.collectionGroup('feedback').get();
  return snapshot.docs.map(({ id }) => id);
}


async function getNames() {
  const users = await getUsers();
  const feedback = await getFeedback();
  const names = feedback.map(id => users[id]);
  fs.writeFileSync('/home/abraham/Desktop/names.txt', names.join("\n"));
  return names.length;
}

getNames().then((count) => console.log(`Found ${count} reviews`));
