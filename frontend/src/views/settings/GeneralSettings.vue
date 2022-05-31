<template>
  <div class="mt-6">

    <div class="flex flex-row justify-between items-center">
      <h1 class="setting-header">Website</h1>
      <SavingChanges :cancel="clearSettings" :save="saveSettings" :disabled="noSettingsChanged || savingSettings" :show="!noSettingsChanged" />
    </div>

    <div class="my-6 border-t border-slate-200/5"></div>

    <h2 class="setting-name">Name</h2>
    <input type='text' v-model="settings.website.name" class="mt-2">

    <div class="my-6 border-t border-slate-200/5"></div>

    <h2 class="setting-name">Categories</h2>
    <ul class="mt-2">
      <li v-for="(category, index) in categoriesState" :key="index" class="flex flex-row" :class="{ 'mt-2': index > 0 }">
        <div class="py-2 px-4 w-full bg-slate-800 rounded-md flex flex-row cursor-grab hover:bg-slate-700 transition duration-200">
          <span class="text-sm text-white">{{ category.name }} ({{ category.num_torrents }})</span>
        </div>
        <button @click="deleteCategory(category.name)" class="ml-2 px-3 flex flex-row items-center bg-red-600 text-xs text-white font-semibold rounded-md transition duration-200 hover:bg-red-500">
          <TrashIcon class="w-5 h-5 text-white opacity-50" />
          <span class="ml-1 whitespace-nowrap">({{category.num_torrents}})</span>
        </button>
      </li>
    </ul>
    <div class="mt-4 flex flex-row">
      <input v-model="newCategory" type='text' placeholder='category name'>
      <button @click="addCategory" :disabled="!newCategory" class="ml-2 px-3 flex flex-row items-center bg-sky-600 text-xs text-white font-semibold rounded-md transition duration-200 hover:bg-sky-500">
        <PlusIcon class="w-5 h-5 text-white opacity-50" />
        <span class="ml-1 whitespace-nowrap">add category</span>
      </button>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import HttpService from "@/common/http-service";
import SelectComponent from "@/components/SelectComponent.vue";
import SavingChanges from "@/components/buttons/saving-changes/SavingChanges.vue";
import { TrashIcon, PlusIcon } from "@vue-hero-icons/outline";

export default {
  name: "GeneralSettings",
  components: { TrashIcon, PlusIcon, SavingChanges, SelectComponent },
  data: () => ({
    TrackerMode: [{ name: "Public" }, { name: "Private" }, { name: "Whitelisted" }, { name: "PrivateWhitelisted" }],
    EmailOnSignup: [{ name: "Required" }, { name: "Optional" }, { name: "None" }],
    tab: 'general',
    newCategory: '',
    savingSettings: false,
    settings: {
      website: {
        name: ""
      },
      tracker: {
        url: "",
        mode: "",
        api_url: "",
        token: "",
        token_valid_seconds: 0
      },
      net: {
        port: 0,
        base_url: null
      },
      auth: {
        email_on_signup: "Optional",
        min_password_length: 0,
        max_password_length: 0,
        secret_key: ""
      },
      database: {
        connect_url: "",
        torrent_info_update_interval: 0
      },
      storage: {
        upload_path: ""
      },
      mail: {
        email_verification_enabled: false,
        from: "",
        reply_to: "",
        username: "",
        password: "",
        server: "",
        port: 0
      }
    }
  }),
  computed: {
    ...mapState(['categories']),
    noSettingsChanged() {
      return JSON.stringify(this.$store.state.settings) === JSON.stringify(this.settings);
    },
    settingsState() {
      return this.$store.state.settings;
    },
    categoriesState() {
      return this.$store.state.categories;
    }
  },
  methods: {
    addCategory() {
      if (this.newCategory) {
        HttpService.post(`/category`, { name: this.newCategory }, () => {
          this.$store.dispatch('getCategories');
        }).catch(() => {
        });
      }
    },
    deleteCategory(category) {
      HttpService.delete(`/category`, { name: category }, () => {
        this.$store.dispatch('getCategories');
      }).catch(() => {
      });
    },
    saveSettings() {
      this.savingSettings = true;
      HttpService.post(`/settings`, this.settings, () => {
        this.$store.dispatch('getSettings');
        this.savingSettings = false;
      }).catch(() => {
        this.savingSettings = false;
      });
    },
    clearSettings() {
      this.settings = JSON.parse(JSON.stringify(this.$store.state.settings));
    },
  },
  beforeMount() {
    this.$store.dispatch('getSettings');
    this.$store.dispatch('getCategories');
  },
  watch: {
    settingsState() {
      this.clearSettings();
    },
  }
}
</script>

<style scoped>
.category-tile {
  @apply bg-cover !important;
  @apply w-full rounded-3xl shadow-lg text-center py-16 relative;
}

label {
  @apply mt-2 block text-gray-200;
}

h2 {
  @apply mt-6 text-xl text-white;
}

h3 {
  @apply mt-2 text-lg text-white;
}

.details {
  @apply inline-flex;
}

.setting-header {
  @apply text-2xl text-slate-200;
}

.setting-name {
  @apply lowercase text-base text-slate-400;
}

.setting-input-container {
  @apply py-1 flex flex-row;
}

button.changes {
  @apply py-1 px-2 text-sm rounded-md disabled:opacity-50;
}

.tab {
  @apply inline-block py-2 px-4 text-sm font-medium text-center text-sky-500 bg-slate-800 rounded-t-md;
}

input {
  @apply py-2 px-4 w-full text-white bg-slate-800 border border-slate-700 rounded-md text-sm shadow-sm cursor-pointer placeholder-slate-400 hover:border-sky-500 focus:bg-slate-800
  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition duration-200;
}
</style>
