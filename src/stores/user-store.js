import { defineStore } from "pinia";
import axios from "axios";
import { v4 as uuid } from 'uuid';
import { db } from '../firebase-init';
import { doc, setDoc, getDoc, getDocs, collection, updateDoc, arrayUnion, onSnapshot, query } from "firebase/firestore"; 

axios.defaults.baseURL = 'http://localhost:4001/'

export const useUserStore = defineStore('userStore', {
    state: () => ({
            sub: '',
            email: '',
            picture: '',
            firstName: '',
            lastName: '',
            allUsers: [],
            userDataForChat: [],
            showFindFriend: false,
            currentChat: null,
            removeUsersFromFindFriends: [],
            chats: []
    }),
    getters: {

    },
    actions: {
        async getUserDetialsFromGoogle(data){
            try{
                const res = await axios.post('/api/google-login', {
                token: data.credential
                });

                let userExists = await this.checkIfUserExists(res.data.sub);
                if(!userExists) await this.saveUserDetails(res);

                this.sub = res.data.sub;
                this.email = res.data.email;
                this.picture = res.data.picture;
                this.firstName = res.data.given_name;
                this.lastName = res.data.family_name;

            } catch(error){
                console.log("google auth error ", error.message);
            }
        },

        async checkIfUserExists(id){
                    const docRef = doc(db, 'users', id);
                    const docSnap = await getDoc(docRef);
                    docSnap.exists();
        },

        async getAllUsers(){
                const querySnapshot = await getDocs(collection(db, "users"));
                let results = [];

                querySnapshot.forEach(doc => results.push(doc.data()));

                if(results.length){
                    this.allUsers = [];
                    results.forEach(res => this.allUsers.push(res));
                }
        },
        async saveUserDetails(res){
            console.log('ressss ', res.data);
                try{
                    await setDoc(doc(db, 'users', res.data.sub), {
                        sub: res.data.sub,
                        email: res.data.email,
                        picture: res.data.picture,
                        firstName: res.data.given_name,
                        lastName: res.data.family_name
                    });
                } catch(error){
                    console.log('error save message ', error.message)
                }
        },
        async sendMessage(data){

                try{
                    if(data.chatId){
                        await updateDoc(doc(db, `chat/${data.chatId}`), {
                            sub1HasViewed:false,
                            sub2HasViewed: false,
                            messages: arrayUnion({
                                sub: this.sub,
                                message: data.message,
                                createAt: Date.now()
                            })
                        })
                    } else {
                        let id = uuid();
                        await setDoc(doc(db, `chat/${id}`), {
                            sub1: this.sub,
                            sub2: data.sub2,
                            sub1HasViewed: false,
                            sub2HasViewed: false,
                            messages: [{
                                sub: this.sub,
                                message: data.message,
                                createAt: Date.now()
                            }]
                        })

                        this.userDataForChat[0].id = id;
                        this.showFindFriend = false;
                    }
                } catch(error){
                    console.log('send message error ', error.message);
                }
        },

        getChatById(id){
            onSnapshot(doc(db, 'chat', id), doc => {
                let res = [];
                res.push(doc.data());
                this.currentChat = res;
            })
        },

        getAllChatsByUser(){
            const q = query(collection(db, 'chat'));

            onSnapshot(q, (querySnapshot) => {
                let chatArray = [];
                querySnapshot.forEach(doc => {
                    let data = {
                        id: doc.id,
                        sub1: doc.data().sub1,
                        sub2: doc.data().sub2,
                        sub1HasViewed: doc.data().sub1HasViewed,
                        sub2HasViewed: doc.data().sub2HasViewed,
                        messages: doc.data().messages
                    }

                    if(doc.data().sub1 === this.sub) chatArray.push(data);
                if(doc.data().sub2 === this.sub) chatArray.push(data);

                this.removeUsersFromFindFriends = [];

                chatArray.forEach(chat => {
                    if(this.sub === chat.sub1){
                        this.allUsers.forEach(user => {
                            if(user.sub == chat.sub2){
                                chat.user = user;
                                this.removeUsersFromFindFriends.push(user.sub);
                            }
                        })
                    }

                    if(this.sub === chat.sub2){
                        this.allUsers.forEach(user => {
                            if(user.sub == chat.sub1){
                                chat.user = user;
                                this.removeUsersFromFindFriends.push(user.sub);
                            }
                        })
                    }
                })

                this.chats = [];
                chatArray.forEach(chat => {
                    this.chats.push(chat);
                })
                });

                
            })
        },
        async hasReadMessage(data){
                await updateDoc(doc(db, `chat/${data.id}`), {
                    [data.key1]: data.val1,
                    [data.key2]: data.val2
                }, {merge: true});
        },
        logout(){
            this.sub = '';
            this.email = '';
            this.picture = '';
            this.lastName = '';
            this.firstName = '';
            this.allUsers = [];
            this.userDataForChat = [];
            this.showFindFriend = false;
            this.chats = [];
            this.userDataForChat = [];
            this.removeUsersFromFindFriends = [];
            this.currentChat = false;
        }
    },
    persist: true
});