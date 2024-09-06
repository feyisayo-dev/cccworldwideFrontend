<script setup>
import { useAllAdminActions } from '@/apiservices/adminActions'
import api from '@/apiservices/api'
import { onMounted, ref } from 'vue'



const props = defineProps({
  committeeMemberData: {
    type: Object,
    required: true,
  },
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'updatedData',
])

const AllAdminActions = useAllAdminActions()
const currentStep = ref(0)
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')
const userData = ref([])

const form = ref({
  committeName: '',
  committeRefno: '',
  chairmen: [''],
  chairpersons: [''],
  secretaries: [''],
  Fsecretaries: [''],
  treasurers: [''],
  MmembersList: [''],
  FmembersList: [''],
})


const dialogVisibleUpdate = val => {
  emit('update:isDialogVisible', val)
  currentStep.value = 0
}

watch(props, () => {
  if (!props.isDialogVisible)
    currentStep.value = 0
})



watchEffect(() => {
  if (props.committeeMemberData) {
    console.log('From view committee show details of title==> ', JSON.stringify(props.committeeMemberData))
    form.value.committeName = props.committeeMemberData.committeName
    form.value.committeRefno = props.committeeMemberData.committeRefno
    form.value.chairmen = props.committeeMemberData.chairmen 
    form.value.chairpersons = props.committeeMemberData.chairpersons
    form.value.secretaries = props.committeeMemberData.secretaries
    form.value.Fsecretaries = props.committeeMemberData.Fsecretaries
    form.value.treasurers = props.committeeMemberData.treasurers
    form.value.MmembersList = props.committeeMemberData.MmembersList
    form.value.FmembersList = props.committeeMemberData.FmembersList
  }
})


const isConfirmDialogVisible = ref(false)
</script>

<template>
  <VDialog
    :model-value="props.isDialogVisible"
    max-width="950"
    scrollable
    @update:model-value="dialogVisibleUpdate"
  >
    <!-- 👉 dialog close btn -->
    <DialogCloseBtn
      size="small"
      @click="emit('update:isDialogVisible', false)"
    />
    <VCard class="create-app-dialog">
      <VCardText class="pa-5 pa-sm-10">
        <h5 class="text-h5 text-center mb-2">
          View Committee Members Details
        </h5>
        <VContainer>
          <VRow>
            <!-- Column for Chairmen -->
            <VCol>
              <h3>Chairmen</h3>
              <VDivider class="mb-4" />
              <VRow
                v-for="chairman in form.chairmen"
                :key="chairman.role"
              >
                {{ chairman.role }}: {{ chairman.name }}
              </VRow>
            </VCol>

            <!-- Column for Chairpersons -->
            <VCol>
              <h3>Chairpersons</h3>
              <VDivider class="mb-4" />
              <VRow
                v-for="chairperson in form.chairpersons"
                :key="chairperson.role"
              >
                {{ chairperson.role }}: {{ chairperson.name }}
              </VRow>
            </VCol>
          </VRow>


          <VRow>
            <!-- Column for Secretaries -->
            <VCol>
              <h3>Secretaries</h3>
              <VDivider class="mb-4" />
              <VRow
                v-for="secretary in form.secretaries"
                :key="secretary.role"
              >
                {{ secretary.role }}: {{ secretary.name }}
              </VRow>
            </VCol>

            <!-- Column for Fsecretaries -->
            <VCol>
              <h3>Financial secretaries</h3>
              <VDivider class="mb-4" />
              <VRow
                v-for="Fsecretary in form.Fsecretaries"
                :key="Fsecretary.role"
              >
                {{ Fsecretary.role }}: {{ Fsecretary.name }}
              </VRow>
            </VCol>
          </VRow>

          <VRow>
            <!-- Column for Treasurers -->
            <VCol>
              <h3>Treasurers</h3>
              <VDivider class="mb-4" />
              <VRow
                v-for="treasurer in form.treasurers"
                :key="treasurer.role"
              >
                {{ treasurer.role }}: {{ treasurer.name }}
              </VRow>
            </VCol>

            <!-- Column for Mmembers -->
            <VCol>
              <h3>Male members</h3>
              <VDivider class="mb-4" />
              <VRow
                v-for="Mmember in form.MmembersList"
                :key="Mmember.role"
              >
                {{ Mmember.role }}: {{ Mmember.name }}
              </VRow>
            </VCol>
          </VRow>

          <VRow>
            <!-- Column for Fmembers -->
            <VCol>
              <h3>Female members</h3>
              <VDivider class="mb-4" />
              <VRow
                v-for="Fmember in form.FmembersList"
                :key="Fmember.role"
              >
                {{ Fmember.role }}: {{ Fmember.name }}
              </VRow>
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.stepper-content .card-list {
  --v-card-list-gap: 24px;
}
</style>
