<script setup>
import { ref, computed, watchEffect } from 'vue'
import api from '@/apiservices/api'

const dropdowns = ref({
  dropdown1: false,
  dropdown2: false,
})

const dropdownItems1 = ref([{ text: 'Item 1' }, { text: 'Item 2' }])
const dropdownItems2 = ref([{ text: 'Item 3' }, { text: 'Item 4' }])

const toggleDropdown = dropdown => {
  dropdowns.value[dropdown] = !dropdowns.value[dropdown]
}

import EventDefualt from '@images/avatars/event_defualt.jpeg'
</script>

<template>
  <VApp
    no-gutters
    class="auth-wrapper bg-surface"
  >
    <VContainer fluid>
      <!-- Navbar -->
      <VRow>
        <VCol cols="2">
          <VNavigationDrawer
            app
            permanent
          >
            <VList>
              <VListItemGroup>
                <!-- Dropdown 1 -->
                <VListItem>
                  <VListItemContent>
                    <VListItemTitle @click="toggleDropdown('dropdown1')">
                      Dropdown 1
                    </VListItemTitle>
                    <VListGroup v-if="dropdowns.dropdown1">
                      <VListItem
                        v-for="item in dropdownItems1"
                        :key="item.text"
                      >
                        {{ item.text }}
                      </VListItem>
                    </VListGroup>
                  </VListItemContent>
                </VListItem>
                <!-- Dropdown 2 -->
                <VListItem>
                  <VListItemContent>
                    <VListItemTitle @click="toggleDropdown('dropdown2')">
                      Dropdown 2
                    </VListItemTitle>
                    <VListGroup v-if="dropdowns.dropdown2">
                      <VListItem
                        v-for="item in dropdownItems2"
                        :key="item.text"
                      >
                        {{ item.text }}
                      </VListItem>
                    </VListGroup>
                  </VListItemContent>
                </VListItem>
                <!-- Add more dropdowns as needed -->
              </VListItemGroup>
            </VList>
          </VNavigationDrawer>
        </VCol>
        <!-- Main Content -->
        <VCol cols="10">
          <VRow>
            <!-- Image Column -->
            <VCol cols="6">
              <VImg
                :src="EventDefualt"
                aspect-ratio="1.78"
              />
            </VCol>
            <!-- Text Column -->
            <VCol cols="6">
              <h1>Welcome to CCC Worldwide</h1>
              <p>
                Here’s a brief description of what CCC Worldwide offers. This could
                be a mission statement, a slogan, or an introduction to the services.
              </p>
              <VBtn color="primary">
                Learn More
              </VBtn>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </VContainer>
  </VApp>
</template>

<style scoped>
h1 {
  font-size: 2.5rem;
  font-weight: bold;
}

p {
  font-size: 1.25rem;
  margin-top: 1rem;
}
</style>
