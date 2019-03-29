import API from "@teamleader/api";

const { users } = API({
  getAccessToken: () => "thisisatoken"
});

const init = async () => {
  const me = await users.me();
  console.log(me);
};
