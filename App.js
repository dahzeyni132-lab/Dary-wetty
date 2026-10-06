import React, {useMemo, useState} from "react";
import {SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, ScrollView, Alert} from "react-native";
import {StatusBar} from "expo-status-bar";

const listings = [
  {id:"1", type:"عقار", mode:"للإيجار", title:"شقة فاخرة في تفرغ زينة", price:"450,000 أوقية / شهر", location:"تفرغ زينة - نواكشوط", image:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900", meta:"3 غرف • 2 حمام"},
  {id:"2", type:"عقار", mode:"للإيجار", title:"منزل في لكصر", price:"350,000 أوقية / شهر", location:"لكصر - نواكشوط", image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900", meta:"4 غرف • 3 حمامات"},
  {id:"3", type:"سيارة", mode:"للبيع", title:"تويوتا كورولا 2015", price:"6,800,000 أوقية", location:"نواكشوط", image:"https://images.unsplash.com/photo-1550355291-bbee04a92027?w=900", meta:"أوتوماتيك • بنزين • 120,000 كم"},
  {id:"4", type:"سيارة", mode:"للبيع", title:"تويوتا هايلاندر 2018", price:"8,500,000 أوقية", location:"تفرغ زينة", image:"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900", meta:"أوتوماتيك • بنزين"},
];

function Header({title, onBack}) {
  return <View style={styles.header}>
    {onBack ? <TouchableOpacity onPress={onBack} style={styles.back}><Text style={styles.backText}>‹</Text></TouchableOpacity> : <View style={{width:40}}/>}
    <Text style={styles.headerTitle}>{title}</Text><View style={{width:40}}/>
  </View>
}

function Home({go}) {
  const [q,setQ]=useState("");
  const featured=listings.slice(0,3);
  return <ScrollView style={styles.page} contentContainerStyle={{paddingBottom:110}}>
    <View style={styles.hero}>
      <Text style={styles.brand}>داري <Text style={{color:"#f5a400"}}>وسيّارتي</Text></Text>
      <Text style={styles.subtitle}>عقارات وسيارات في موريتانيا</Text>
      <View style={styles.search}><Text style={{fontSize:20}}>⌕</Text><TextInput value={q} onChangeText={setQ} placeholder="ماذا تبحث عنه؟" placeholderTextColor="#777" style={styles.searchInput}/></View>
    </View>
    <Text style={styles.sectionTitle}>اختر القسم</Text>
    <View style={styles.categoryRow}>
      <TouchableOpacity style={[styles.category,{backgroundColor:"#eaf3ff"}]} onPress={()=>go("cars")}><Text style={styles.catIcon}>🚗</Text><Text style={styles.catTitle}>سيارات</Text><Text style={styles.catSub}>للبيع</Text></TouchableOpacity>
      <TouchableOpacity style={[styles.category,{backgroundColor:"#eef9f0"}]} onPress={()=>go("properties")}><Text style={styles.catIcon}>🏠</Text><Text style={styles.catTitle}>عقارات</Text><Text style={styles.catSub}>للإيجار أو البيع</Text></TouchableOpacity>
    </View>
    <View style={styles.quickRow}>
      {["وظائف","خدمات","أراضي"].map(x=><TouchableOpacity key={x} style={styles.quick}><Text style={{fontSize:18}}>●</Text><Text>{x}</Text></TouchableOpacity>)}
    </View>
    <View style={styles.sectionLine}><Text style={styles.sectionTitle}>إعلانات مميزة</Text><TouchableOpacity onPress={()=>go("all")}><Text style={styles.link}>عرض الكل</Text></TouchableOpacity></View>
    {featured.map(item=><ListingCard key={item.id} item={item} onPress={()=>go("detail",item)}/>)}
    <TouchableOpacity style={styles.addButton} onPress={()=>go("add")}><Text style={styles.addButtonText}>＋ أضف إعلانك</Text></TouchableOpacity>
  </ScrollView>
}

function ListingCard({item,onPress}) {
 return <TouchableOpacity style={styles.card} onPress={onPress}>
   <Image source={{uri:item.image}} style={styles.thumb}/>
   <View style={{flex:1,padding:8}}>
     <View style={styles.badge}><Text style={styles.badgeText}>{item.mode}</Text></View>
     <Text style={styles.cardTitle}>{item.title}</Text>
     <Text style={styles.price}>{item.price}</Text>
     <Text style={styles.muted}>{item.meta}</Text><Text style={styles.muted}>⌖ {item.location}</Text>
   </View>
 </TouchableOpacity>
}

function Listings({kind,go}) {
 const data=useMemo(()=>kind==="cars"?listings.filter(x=>x.type==="سيارة"):listings.filter(x=>x.type==="عقار"),[kind]);
 const [search,setSearch]=useState("");
 const shown=data.filter(x=>(x.title+x.location).includes(search));
 return <View style={styles.page}>
   <Header title={kind==="cars"?"السيارات":"العقارات"} onBack={()=>go("home")}/>
   <View style={styles.toggle}><TouchableOpacity style={[styles.toggleBtn,kind==="cars"&&styles.active]}><Text style={kind==="cars"?styles.activeText:styles.toggleText}>للبيع</Text></TouchableOpacity><TouchableOpacity style={[styles.toggleBtn,kind!=="cars"&&styles.active]}><Text style={kind!=="cars"?styles.activeText:styles.toggleText}>للإيجار</Text></TouchableOpacity></View>
   <TextInput value={search} onChangeText={setSearch} placeholder="ابحث..." style={styles.input}/>
   <View style={styles.filters}><Text style={styles.filter}>الولاية⌄</Text><Text style={styles.filter}>السعر⌄</Text><Text style={styles.filter}>{kind==="cars"?"الماركة":"نوع العقار"}⌄</Text></View>
   <FlatList data={shown} keyExtractor={x=>x.id} renderItem={({item})=><ListingCard item={item} onPress={()=>go("detail",item)}/>} contentContainerStyle={{padding:12,paddingBottom:100}}/>
 </View>
}

function Detail({item,go}) {
 return <ScrollView style={styles.page} contentContainerStyle={{paddingBottom:110}}>
   <Header title={item.type==="سيارة"?"تفاصيل السيارة":"تفاصيل العقار"} onBack={()=>go(item.type==="سيارة"?"cars":"properties")}/>
   <Image source={{uri:item.image}} style={styles.detailImage}/>
   <View style={{padding:16}}>
     <View style={styles.badge}><Text style={styles.badgeText}>{item.mode}</Text></View>
     <Text style={styles.detailTitle}>{item.title}</Text><Text style={styles.detailPrice}>{item.price}</Text>
     <Text style={styles.location}>⌖ {item.location}</Text>
     <View style={styles.infoBox}><Text>{item.meta}</Text><Text style={{color:"#777"}}>•</Text><Text>إعلان موثوق</Text></View>
     <Text style={styles.sectionTitle}>الوصف</Text><Text style={styles.description}>إعلان مميز بحالة جيدة. التفاصيل قابلة للتحديث من صاحب الإعلان، ويمكنك التواصل معه مباشرة عبر الرسالة أو الاتصال.</Text>
     <View style={styles.actions}><TouchableOpacity style={styles.primary}><Text style={styles.primaryText}>☎ اتصال</Text></TouchableOpacity><TouchableOpacity style={styles.secondary}><Text style={styles.secondaryText}>✉ رسالة</Text></TouchableOpacity></View>
   </View>
 </ScrollView>
}

function Add({go}) {
 const [kind,setKind]=useState("سيارة"); const [title,setTitle]=useState(""); const [price,setPrice]=useState("");
 return <ScrollView style={styles.page} contentContainerStyle={{paddingBottom:100}}>
  <Header title="أضف إعلانك" onBack={()=>go("home")}/>
  <View style={styles.kindRow}><TouchableOpacity onPress={()=>setKind("سيارة")} style={[styles.kindCard,kind==="سيارة"&&styles.kindActive]}><Text style={{fontSize:28}}>🚗</Text><Text>سيارة</Text></TouchableOpacity><TouchableOpacity onPress={()=>setKind("عقار")} style={[styles.kindCard,kind==="عقار"&&styles.kindActive]}><Text style={{fontSize:28}}>🏠</Text><Text>عقار</Text></TouchableOpacity></View>
  <Text style={styles.label}>نوع الإعلان</Text><View style={styles.select}><Text>للبيع / للإيجار</Text><Text>⌄</Text></View>
  <Text style={styles.label}>العنوان</Text><TextInput value={title} onChangeText={setTitle} placeholder="مثال: تويوتا كورولا 2015" style={styles.input}/>
  <Text style={styles.label}>الولاية / المدينة</Text><TextInput placeholder="مثال: نواكشوط" style={styles.input}/>
  <Text style={styles.label}>السعر</Text><TextInput value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="أدخل السعر" style={styles.input}/>
  <Text style={styles.label}>الوصف</Text><TextInput multiline placeholder="اكتب تفاصيل الإعلان..." style={[styles.input,{height:110,textAlignVertical:"top"}]}/>
  <TouchableOpacity style={styles.primaryWide} onPress={()=>{Alert.alert("تم الحفظ","تم إنشاء الإعلان كنسخة تجريبية.");go("home")}}><Text style={styles.primaryText}>نشر الإعلان</Text></TouchableOpacity>
 </ScrollView>
}

function Profile({go}) {
 return <ScrollView style={styles.page} contentContainerStyle={{paddingBottom:100}}>
  <Header title="حسابي" onBack={()=>go("home")}/>
  <View style={styles.profile}><View style={styles.avatar}><Text style={{fontSize:30}}>👤</Text></View><Text style={styles.detailTitle}>مستخدم جديد</Text><Text style={styles.muted}>+222 XX XX XX XX</Text></View>
  {["إعلاناتي","المفضلة","المحادثات","الإشعارات","الإعدادات","المساعدة والدعم"].map(x=><TouchableOpacity style={styles.menu} key={x}><Text>{x}</Text><Text>‹</Text></TouchableOpacity>)}
 </ScrollView>
}

export default function App(){
 const [screen,setScreen]=useState("home"); const [selected,setSelected]=useState(null);
 const go=(s,item=null)=>{setSelected(item);setScreen(s)};
 return <SafeAreaView style={{flex:1,backgroundColor:"#f7f8fa"}}><StatusBar style="light"/>
   {screen==="home"&&<Home go={go}/>}
   {screen==="cars"&&<Listings kind="cars" go={go}/>}
   {screen==="properties"&&<Listings kind="properties" go={go}/>}
   {screen==="all"&&<Listings kind="properties" go={go}/>}
   {screen==="detail"&&selected&&<Detail item={selected} go={go}/>}
   {screen==="add"&&<Add go={go}/>}
   {screen==="profile"&&<Profile go={go}/>}
   {screen!=="detail"&&screen!=="add"&&<View style={styles.nav}><TouchableOpacity onPress={()=>go("home")}><Text style={screen==="home"?styles.navActive:styles.navText}>⌂{"\n"}الرئيسية</Text></TouchableOpacity><TouchableOpacity><Text style={styles.navText}>♡{"\n"}المفضلة</Text></TouchableOpacity><TouchableOpacity onPress={()=>go("add")} style={styles.plus}><Text style={{color:"#fff",fontSize:28}}>＋</Text></TouchableOpacity><TouchableOpacity><Text style={styles.navText}>▢{"\n"}المحادثات</Text></TouchableOpacity><TouchableOpacity onPress={()=>go("profile")}><Text style={screen==="profile"?styles.navActive:styles.navText}>♙{"\n"}حسابي</Text></TouchableOpacity></View>}
 </SafeAreaView>
}

const styles=StyleSheet.create({
 page:{flex:1,backgroundColor:"#f7f8fa"},hero:{backgroundColor:"#07549b",padding:22,paddingTop:18,borderBottomLeftRadius:26,borderBottomRightRadius:26},brand:{color:"#fff",fontSize:28,fontWeight:"800",textAlign:"center"},subtitle:{color:"#dbeeff",textAlign:"center",marginTop:4,marginBottom:18},search:{backgroundColor:"#fff",borderRadius:13,paddingHorizontal:12,flexDirection:"row",alignItems:"center"},searchInput:{flex:1,padding:12,textAlign:"right"},sectionTitle:{fontSize:18,fontWeight:"800",textAlign:"right",margin:16,marginBottom:10},categoryRow:{flexDirection:"row",gap:12,paddingHorizontal:14},category:{flex:1,padding:18,borderRadius:18,alignItems:"center"},catIcon:{fontSize:34},catTitle:{fontSize:19,fontWeight:"800",marginTop:6},catSub:{color:"#666",marginTop:3},quickRow:{flexDirection:"row",justifyContent:"space-around",padding:14},quick:{backgroundColor:"#fff",padding:12,borderRadius:14,alignItems:"center",minWidth:90},sectionLine:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingHorizontal:14},link:{color:"#075fc0",fontWeight:"700"},card:{backgroundColor:"#fff",marginHorizontal:14,marginBottom:12,borderRadius:16,overflow:"hidden",flexDirection:"row-reverse",borderWidth:1,borderColor:"#e7e9ed"},thumb:{width:125,height:115},badge:{alignSelf:"flex-start",backgroundColor:"#18a957",paddingHorizontal:8,paddingVertical:4,borderRadius:7,marginBottom:5},badgeText:{color:"#fff",fontSize:11,fontWeight:"800"},cardTitle:{fontSize:15,fontWeight:"800",textAlign:"right"},price:{color:"#075fc0",fontWeight:"800",textAlign:"right",marginTop:4},muted:{color:"#6d727a",fontSize:11,textAlign:"right",marginTop:4},addButton:{margin:14,backgroundColor:"#075fc0",padding:15,borderRadius:14,alignItems:"center"},addButtonText:{color:"#fff",fontSize:16,fontWeight:"800"},header:{backgroundColor:"#07549b",padding:14,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},headerTitle:{color:"#fff",fontSize:20,fontWeight:"800"},back:{width:40,height:40,justifyContent:"center",alignItems:"center"},backText:{color:"#fff",fontSize:35},toggle:{flexDirection:"row",backgroundColor:"#e9edf2",margin:14,borderRadius:12,padding:3},toggleBtn:{flex:1,padding:11,alignItems:"center",borderRadius:10},active:{backgroundColor:"#075fc0"},activeText:{color:"#fff",fontWeight:"800"},toggleText:{color:"#333"},input:{backgroundColor:"#fff",borderWidth:1,borderColor:"#e0e3e8",borderRadius:12,padding:13,marginHorizontal:14,marginBottom:10,textAlign:"right",fontSize:16},filters:{flexDirection:"row",gap:7,paddingHorizontal:14,marginBottom:2},filter:{backgroundColor:"#fff",borderWidth:1,borderColor:"#e2e5e9",padding:9,borderRadius:10,flex:1,textAlign:"center",fontSize:12},detailImage:{width:"100%",height:250},detailTitle:{fontSize:23,fontWeight:"900",textAlign:"right",marginVertical:8},detailPrice:{fontSize:20,fontWeight:"900",color:"#075fc0",textAlign:"right"},location:{textAlign:"right",color:"#555",marginVertical:10},infoBox:{backgroundColor:"#fff",padding:15,borderRadius:14,flexDirection:"row",justifyContent:"space-around",marginBottom:10},description:{fontSize:15,lineHeight:25,textAlign:"right",color:"#555"},actions:{flexDirection:"row",gap:10,marginTop:20},primary:{flex:1,backgroundColor:"#075fc0",padding:14,borderRadius:12,alignItems:"center"},secondary:{flex:1,backgroundColor:"#fff",borderWidth:1,borderColor:"#075fc0",padding:14,borderRadius:12,alignItems:"center"},primaryText:{color:"#fff",fontWeight:"800",fontSize:16},secondaryText:{color:"#075fc0",fontWeight:"800",fontSize:16},kindRow:{flexDirection:"row",gap:12,padding:14},kindCard:{flex:1,backgroundColor:"#fff",borderWidth:1,borderColor:"#e0e3e8",borderRadius:14,padding:18,alignItems:"center"},kindActive:{borderColor:"#075fc0",backgroundColor:"#eef6ff"},label:{textAlign:"right",marginHorizontal:14,marginBottom:6,fontWeight:"700"},primaryWide:{margin:14,backgroundColor:"#075fc0",padding:16,borderRadius:12,alignItems:"center"},profile:{alignItems:"center",padding:28},avatar:{width:82,height:82,borderRadius:41,backgroundColor:"#e7eef7",justifyContent:"center",alignItems:"center",marginBottom:10},menu:{backgroundColor:"#fff",marginHorizontal:14,marginBottom:8,padding:17,borderRadius:12,flexDirection:"row-reverse",justifyContent:"space-between"},nav:{position:"absolute",bottom:0,left:0,right:0,height:72,backgroundColor:"#fff",borderTopWidth:1,borderTopColor:"#ddd",flexDirection:"row",justifyContent:"space-around",alignItems:"center"},navText:{textAlign:"center",color:"#666",fontSize:11},navActive:{textAlign:"center",color:"#075fc0",fontWeight:"800",fontSize:11},plus:{backgroundColor:"#075fc0",width:52,height:52,borderRadius:26,justifyContent:"center",alignItems:"center",marginTop:-24}
});
