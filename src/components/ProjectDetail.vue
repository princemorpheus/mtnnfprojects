<script setup>
import { defineProps, defineEmits, toRefs } from "vue";
const BASEURL = process.env.BASE_URL;
const props = defineProps(["info", "categories", "subcategories", "states"]);
const emit = defineEmits(["close"]);
const { info, categories, subcategories, states } = toRefs(props);
</script>
<template>
  <div
    class="absolute white-90 p-0"
    style="height: 100%; max-width: 100%; width: 860px; right: 0px; z-index: 90"
  >
    <div class="relative" style="height: 100%; width: 100%">
      <span
        @click="emit('close')"
        class="cursor size36 w3-text-red w3-hover-text-orange absolute"
        style="right: 10px; top: 10px"
        ><font-awesome-icon icon="fa-solid fa-xmark"
      /></span>

      <div
        class="p-0 w3-white"
        style="min-height: 100%; max-height: 100%; width: 100%; overflow: auto"
      >
        <div
          class="w3-grey background-image background-cover;"
          :style="{
            backgroundImage: info.banner_filename
              ? `url(${BASEURL}images/banners/${info.banner_filename})`
              : null,
          }"
          style="width: 100%; height: 300px"
        ></div>
        <div class="mt-3 pt-2 px-4 m-0 relative">
          <div class="absolute" style="top: -30px">
            <span class="w3-round-xxlarge bg--yellow w3-border px-3 py-2 m-2">
              <img
                v-if="categories[info.category_uuid].icon_filename"
                :src="`${BASEURL}images/icons/categories/${
                  categories[info.category_uuid].icon_filename
                }`"
                style="width: 24px"
              />
              {{ categories[info.category_uuid].name }}
            </span>
            <span class="w3-round-xxlarge w3-white w3-border px-3 py-2 m-2">
              <img
                v-if="subcategories[info.subcategory_uuid].icon_filename"
                :src="`${BASEURL}images/icons/subcategories/${
                  subcategories[info.subcategory_uuid].icon_filename
                }`"
                style="width: 24px"
              />
              {{ subcategories[info.subcategory_uuid].name }}
            </span>
          </div>
          <h3 class="mb-5 mb-sm-4 mt-5 bold">{{ info.title }}</h3>

          <template v-if="info.sdg.length">
            <p
              class="
                text-uppercase
                font-weight-lighter
                w3-text-grey
                size12
                mb-2
              "
            >
              Social Development Goal<span v-if="info.sdg.length > 1">s</span>
            </p>
            <div class="w3-row mb-5 mb-sm-4 justify-start">
              <div
                v-for="sdg in info.sdg"
                :key="sdg"
                class="w3-col l2 m3 s4"
                style="max-width: 100px"
              >
                <div class="border-yello m-2" :title="sdg.value">
                  <img
                    :src="`${BASEURL}images/sdg-goals/sdg-${sdg}.png`"
                    style="width: 100%"
                  />
                </div>
              </div>
            </div>
          </template>
          <div class="my-4 w3-border-top w3-border-light-grey py-3">
            <p
              v-if="info.address || info.location_uuid || info.state_uuid"
              class="
                text-uppercase
                font-weight-lighter
                w3-text-grey
                size12
                mb-2
              "
            >
              Location
            </p>
            <div v-if="info.address">{{ info.address }}</div>
            <div>
              <!-- <span v-if="info.location_uuid"
                >{{ cities[info.location_uuid].name }}, </span
              > -->
              <span v-if="info.state_uuid"
                >{{ states[info.state_uuid].name }}
              </span>
            </div>
          </div>
          <div
            v-if="info.description"
            class="mb-3"
            v-html="info.description"
            style="line-height: 24px"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>