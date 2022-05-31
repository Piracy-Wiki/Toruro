import Layout from "../components/Layout.vue";
import TorrentDetail from "../views/Torrent.vue";
import CategoryOverview from "../views/CategoryOverview.vue";
import TorrentUpload from "../views/TorrentUpload.vue";
import VueRouter from "vue-router";
import Torrents from "../views/Torrents.vue";
import Welcome from "../views/Welcome.vue";
import Settings from "../views/settings/Settings.vue";
import GeneralSettings from "../views/settings/GeneralSettings.vue";

const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '/',
                name: 'Welcome',
                component: Welcome,
            },
            {
                path: 'settings/general',
                name: 'General Settings',
                component: GeneralSettings,
            },
            {
                path: 'categories',
                name: "Categories",
                component: CategoryOverview
            },
            {
                path: 'torrent/:torrentId/:title?/:download?',
                name: 'Torrent',
                component: TorrentDetail
            },
            {
                path: 'torrents/:sorting?',
                name: 'Browse Torrents',
                component: Torrents,
            },
            {
                path: 'upload',
                name: 'Upload Torrent',
                component: TorrentUpload
            },
        ]
    }
];

const router = new VueRouter({
    mode: 'history',
    routes
});

export default router
