<script setup>
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars*/
import { computed, ref, nextTick, onMounted, watchEffect } from "vue";
import ProjectsData from "@/data/projects.json";
import mapCategories from "@/data/categories.json";
import mapSubcategories from "@/data/subcategories.json";
import ProjectDetail from "@/components/ProjectDetail.vue";
import states from "@/data/ngstates.json";
import ngcities from "@/data/ngcities.json";
import Paginate from "vuejs-paginate-next";

const BASEURL = process.env.BASE_URL;
console.log(BASEURL);
const ActiveCategory = ref(null);
const ActiveSubcategory = ref(null);

const Projects = computed(() => {
  return ProjectsData;
});

const iProject = ref({ id: null, uuid: null, marker: null });
const project = ref(new URL(location.href).searchParams.get("project"));
const isNew = ref(project.value ? true : false);
const page = ref(1);
const perPages = [12, 24, 48, 60, 100, 200];
const perPage = ref(perPages[1]);
const mapState = ref("");
const mapLocation = ref("");

const categories = computed(() => {
  const categories = {};
  // projectData.categories.map((c) => {
  mapCategories.map((c) => {
    categories[c.uuid] = c;
  });
  return categories;
});
console.log("categories", categories.value);
const subcategories = computed(() => {
  const subcategories = {};
  mapSubcategories.map((c) => {
    subcategories[c.uuid] = c;
  });
  return subcategories;
});
console.log("subcategories", subcategories.value);
const cities = computed(() => {
  const cities = {};
  ngcities.map((c) => {
    const suuid =
      typeof c.state_uuid !== "string" ? c.state_uuid.toString() : c.state_uuid;
    if (!cities[suuid]) {
      cities[suuid] = [];
    }
    cities[suuid].push(c);
  });
  return cities;
});
console.log("cities", cities.value);
const States = computed(() => {
  const allStates = [];
  let allStatesArray = [];
  Projects.value.forEach((d) => {
    const state_uuid =
      typeof d.state_uuid !== "string" ? d.state_uuid.toString() : d.state_uuid;
    if (!allStates.length || !allStates.includes(state_uuid)) {
      allStates.push(state_uuid);
    }
  });
  allStatesArray = states.filter((s) => {
    const suuid = typeof s.uuid !== "string" ? s.uuid.toString() : s.uuid;
    return allStates.includes(suuid);
  });
  return allStatesArray;
});
console.log("states", States.value);
const Lgas = computed(() => {
  if (!mapState.value) return [];
  const allLga = [];
  const UniqueLga = [];

  const stateData = Projects.value.filter((d) => {
    const d_state_uuid =
      typeof d.state_uuid !== "string" ? d.state_uuid.toString() : d.state_uuid;
    return mapState.value === d_state_uuid;
  });

  stateData.forEach((d) => {
    const suuid =
      typeof d.state_uuid !== "string" ? d.state_uuid.toString() : d.state_uuid;
    const cuuid =
      typeof d.location_uuid !== "string"
        ? d.location_uuid.toString()
        : d.location_uuid;

    if (!allLga.length || !allLga.includes(cuuid)) {
      allLga.push(cuuid);
      const l = cities.value[suuid].filter((sc) => sc.uuid === cuuid)[0];
      if (l) UniqueLga.push(l);
    }
  });
  return UniqueLga;
});
const SelectedBoundaryName = computed(() => {
  if (mapState.value) {
    return States.value.filter((s) => s.uuid === mapState.value)[0].name;
  }
  return "Nigeria";
});
const ChangeState = () => {
  selectedProject.value = null;
  mapLocation.value = "";
  page.value = 1;
  ActiveCategory.value = null;
  ActiveSubcategory.value = null;
};
const ChangeLocation = () => {
  selectedProject.value = null;
  page.value = 1;
  ActiveCategory.value = null;
  ActiveSubcategory.value = null;
};

const toggleCategory = (category) => {
  selectedProject.value = null;
  page.value = 1;
  ActiveCategory.value = category;
  ActiveSubcategory.value = null;
};
const toggleSubcategory = (subcategory) => {
  selectedProject.value = null;
  page.value = 1;
  ActiveSubcategory.value = subcategory;
};
const selectedProject = ref(null);
const ShowDetail = (project) => {
  selectedProject.value = null;
  nextTick(() => {
    selectedProject.value = project;
  });
};
console.log("Projects", Projects.value);
const allData = computed(() =>
  Projects.value.filter((p) => {
    return (
      (!mapLocation.value ||
        (mapLocation.value && p.location_uuid === mapLocation.value)) &&
      (!mapState.value ||
        (mapState.value && p.state_uuid === mapState.value)) &&
      (!ActiveSubcategory.value ||
        (ActiveSubcategory.value &&
          p.subcategory_uuid === ActiveSubcategory.value)) &&
      (!ActiveCategory.value ||
        (ActiveCategory.value && p.category_uuid === ActiveCategory.value))
    );
  })
);
const AllCategories = computed(() => {
  const AllCategories = [];
  Projects.value.map((d) => {
    if (!AllCategories.includes(d.category_uuid))
      AllCategories.push(d.category_uuid);
  });

  return AllCategories;
});
const AllSubcategories = computed(() => {
  const AllSubcategories = [];
  Projects.value.map((p) => {
    if (!AllSubcategories.includes(p.subcategory_uuid))
      AllSubcategories.push(p.subcategory_uuid);
  });

  return AllSubcategories;
});
const PagedData = computed(() => {
  const start = (page.value - 1) * perPage.value;
  const end = start + perPage.value;
  const data = allData.value.filter((p, i) => {
    return i >= start && i < end;
  });
  return data;
});
const pageCount = computed(() => {
  return Math.ceil(allData.value.length / perPage.value);
});
</script>
  <template>
  <teleport to="body">
    <ProjectDetail
      v-if="selectedProject"
      :info="selectedProject"
      :categories="categories"
      :subcategories="subcategories"
      :states="states"
      class="w3-animate-right"
      @close="selectedProject = null"
    />
  </teleport>
  <div class="container">
    <div class="width100p">
      <div class="d-flex justify-content-center">
        <div class="w3-mobile p-2">
          <select
            v-model="mapState"
            @change="ChangeState"
            class="
              p-2
              mtn-border
              text-black
              cursor
              hover-effect
              w3-round-xxlarge
              px-2
              m-1
              size13
            "
            style="display: inline-block; width: 30% !important"
          >
            <option value="">All states</option>
            <option
              v-for="state in States"
              :key="state.uuid"
              :value="state.uuid"
            >
              {{ state.name }}
            </option>
          </select>
          <select
            v-model="mapLocation"
            @change="ChangeLocation"
            class="
              p-2
              mtn-border
              text-black
              cursor
              hover-effect
              w3-round-xxlarge
              px-2
              m-1
              size13
            "
            style="display: inline-block; width: 45% !important"
          >
            <option value="">
              All locations in {{ SelectedBoundaryName }}
            </option>
            <option v-for="lga in Lgas" :key="lga.uuid" :value="lga.uuid">
              {{ lga.name }}
            </option>
          </select>
        </div>
        <div class="w3-mobile p-2">
          <div
            @click="toggleCategory(null)"
            class="
              w3-button
              px-2
              mtn-hover-bg mtn-border
              border-1
              text-black
              cursor
              hover-effect
              w3-round-xxlarge
              m-1
              size13
              w3-animate-opacity
            "
            :class="[!ActiveCategory ? 'w3-yellow bold' : 'w3-white']"
          >
            All
          </div>
          <template v-for="c in AllCategories" :key="c">
            <div
              v-if="categories[c]"
              :key="c"
              @click="toggleCategory(categories[c].uuid)"
              class="
                w3-button
                px-2
                mtn-hover-bg mtn-border
                border-1
                text-black
                cursor
                hover-effect
                w3-round-xxlarge
                m-1
                size13
                w3-animate-opacity
              "
              :class="[
                ActiveCategory === categories[c].uuid
                  ? 'w3-yellow bold'
                  : 'w3-white',
              ]"
            >
              <img
                v-if="categories[c].icon_filename"
                :src="`${BASEURL}images/icons/categories/${categories[c].icon_filename}`"
                style="width: 16px"
              />
              {{ categories[c].name }}
            </div>
          </template>
        </div>
      </div>
      <div v-if="ActiveCategory" class="w3-center mb-3">
        <span
          v-if="AllSubcategories.length > 2"
          @click="toggleSubcategory(null)"
          class="
            w3-button
            px-2
            mtn-hover-bg mtn-border
            border-1
            text-black
            cursor
            hover-effect
            w3-round-xxlarge
            m-1
            size13
            w3-animate-opacity
          "
          :class="[!ActiveSubcategory ? 'mtn-bg bold' : 'w3-white']"
        >
          All
        </span>
        <template v-for="sc in AllSubcategories" :key="sc">
          <span
            v-if="
              subcategories[sc] &&
              subcategories[sc].category_uuid === ActiveCategory
            "
            @click="toggleSubcategory(sc)"
            class="
              w3-button
              px-2
              mtn-hover-bg mtn-border
              border-1
              text-black
              cursor
              hover-effect
              w3-round-xxlarge
              m-1
              size13
              w3-animate-opacity
            "
            :class="[ActiveSubcategory === sc ? 'mtn-bg bold' : 'w3-white']"
          >
            <img
              v-if="subcategories[sc].icon_filename"
              :src="`${BASEURL}images/icons/subcategories/${subcategories[sc].icon_filename}`"
              style="width: 16px"
            />
            {{ subcategories[sc].name }}
          </span>
        </template>
      </div>
    </div>
    <div class="d-flex justify-content-center align-content-start">
      <div class="" style="width: 120px">
        <select
          v-model="perPage"
          class="
            p-2
            border-yello
            text-black
            cursor
            hover-effect
            px-2
            mx-3
            size13
          "
          style="display: block; width: 100% !important"
        >
          <option v-for="n in perPages" :key="n" :value="n">
            Showing {{ n }}
          </option>
        </select>
      </div>
      <div v-if="pageCount > 1" class="">
        <paginate
          v-model="page"
          :page-count="pageCount"
          :page-range="3"
          :margin-pages="3"
          :prev-text="'<<'"
          :next-text="'>>'"
          :container-class="'pagination'"
          :page-link-class="'page-link w3-text-black cursor hover-effect w3-border-light-grey'"
          :prev-class="'prev-item w3-text-black cursor hover-effect w3-border-light-grey'"
          :prev-link-class="'page-link prev-link-item w3-text-black cursor w3-white hover-effect w3-border-light-grey'"
          :next-class="'next-item w3-text-black cursor hover-effect w3-border-light-grey'"
          :next-link-class="'page-link next-link-item w3-text-black cursor hover-effect w3-border-light-grey'"
          :page-class="'page-item w3-yellow w3-hover-black cursor hover-effect w3-border-light-grey'"
          :first-last-button="false"
        >
        </paginate>
      </div>
    </div>
    <div style="width: 100%; overflow-x: hidden">
      <div class="row" v-if="PagedData.length">
        <div
          v-for="project in PagedData"
          :key="project.uuid"
          class="col-lg-4 col-md-6 grid-padding"
        >
          <div class="mx-3 my-4">
            <div
              class="
                mtn-card
                mtn-card--shadow
                mtn-card--image
                mtn-card--link
                mtn-card--cursor
                mtn-card--large
              "
              style="background-repeat: no-repeat; background-position: center"
              :style="{
                backgroundImage: `url(${BASEURL}images/banners/${project.banner_filename})`,
              }"
              @click.prevent="ShowDetail(project)"
            >
              <div
                class="w3-white px-3 py-0 d-inline-block w3-round-xxlarge"
                style="font-size: 13px"
                v-if="subcategories[project.subcategory_uuid]"
              >
                <img
                  v-if="subcategories[project.subcategory_uuid].icon_filename"
                  class="m-0"
                  :src="`${BASEURL}images/icons/subcategories/${
                    subcategories[project.subcategory_uuid].icon_filename
                  }`"
                  style="width: 24px"
                />
                {{ subcategories[project.subcategory_uuid].name }}
              </div>
              <div class="mtn-card__content">
                <div
                  class="mtn-tag mtn-tag--yellow px-3 mb-2"
                  style="font-size: 14px; padding: 0px 12px !important"
                >
                  <img
                    v-if="categories[project.category_uuid].icon_filename"
                    :src="`${BASEURL}images/icons/categories/${
                      categories[project.category_uuid].icon_filename
                    }`"
                    style="width: 24px; padding: 0px !important"
                  />
                  {{ categories[project.category_uuid].name }}
                </div>

                <h5 class="h4 mb-4">{{ project.title }}</h5>

                <button
                  @click.prevent.stop="ShowDetail(project)"
                  type="default"
                  class="mtn-btn mtn-btn--text-right-icon mtn-btn--skin-yellow"
                >
                  <span class="btn-text">Read More</span>
                  <i class="mdi mdi-18px mdi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="mt-5 p-5 w3-light-grey">No data found</div>
    </div>
  </div>
</template>
<style>
.active > .page-link,
.page-link.active {
  background-color: #ffcc01 !important;
  color: #000;
}
.page-link {
  background-color: #fff !important;
  color: #000;
}
.mtn-color {
  color: #ffcc01 !important;
}
.mtn-bg {
  background-color: #ffcc01 !important;
}
.mtn-hover-bg:hover {
  background-color: #ffcc01 !important;
}
.mtn-bg-light {
  background-color: rgba(255, 204, 1, 0.5) !important;
}
.mtn-border {
  border-color: #ffcc01 !important;
  border-style: solid !important;
}
.border-1 {
  border-width: 1px !important;
}
</style>

