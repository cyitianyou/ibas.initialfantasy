package org.colorcoding.ibas.initialfantasy.bo.shells;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import org.colorcoding.ibas.bobas.data.emYesNo;
import org.colorcoding.ibas.initialfantasy.bo.boinformation.IBOPropertyInformation;

/**
 * 业务对象属性信息
 * 
 * @author Niuren.Zhu
 *
 */
@XmlAccessorType(XmlAccessType.NONE)
@XmlType(name = "BOPropertyInfo")
@XmlRootElement(name = "BOPropertyInfo")
public class BOPropertyInfo {

	public static BOPropertyInfo create(IBOPropertyInformation propertyItem) {
		BOPropertyInfo propertyInfo = new BOPropertyInfo();
		propertyInfo.setProperty(propertyItem.getProperty());
		propertyInfo.setSearched(propertyItem.getSearched() == emYesNo.YES ? true : false);
		return propertyInfo;
	}

	/** 属性 */
	private String property;

	public String getProperty() {
		return property;
	}

	public void setProperty(String property) {
		this.property = property;
	}

	/** 查询 */
	private boolean searched;

	public boolean isSearched() {
		return searched;
	}

	public void setSearched(boolean searched) {
		this.searched = searched;
	}
}