<?php	global $_W,$_GPC;	$this->getuserinfo();	$orderno = $_GPC['orderno'];	$type = $_GPC['type'];	if($type=='confirm'){		pdo_update('tg_order',array('status'=>4),array('orderno'=>$orderno));	}	if(!empty($orderno)){		$sql = 'SELECT * FROM '.tablename('tg_order').' WHERE orderno=:orderno  and uniacid = :uniacid';		$params = array(':orderno'=>$orderno , ':uniacid'=>$_W['uniacid']);		$order = pdo_fetch($sql, $params); 		$option  = pdo_fetch("select title,productprice,marketprice,stock from " . tablename("tg_goods_option") . " where id=:id limit 1", array(":id" => $order['optionid']));		if(empty($order)){			message('获取订单信息失败.'.$id, $this->createMobileUrl('index'));		}		$sql = 'SELECT gname,gprice,oprice,gimg,id,freight FROM '.tablename('tg_goods').' WHERE id=:gid and uniacid = :uniacid';		$params = array(':gid'=>$order['g_id'], ':uniacid'=>$_W['uniacid']);		$goods = pdo_fetch($sql, $params);		if(empty($goods)){			message('获取商品信息失败', $this->createMobileUrl('index'));		}	}	include $this->template('orderdetails');?>